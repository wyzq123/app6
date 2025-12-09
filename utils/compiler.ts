import { CommandType } from '../types';

/**
 * Compiles a list of user inputs into a flat list of executable actions.
 * Handles nested loops logic: LoopStart -> [Actions] -> LoopEnd -> Multiplier(Optional)
 * Also handles single command multipliers: Command -> Multiplier(Optional)
 */
export const compileCommands = (commands: CommandType[]): CommandType[] => {
  const result: CommandType[] = [];
  let i = 0;

  while (i < commands.length) {
    const cmd = commands[i];

    if (cmd === CommandType.LOOP_START) {
      // Find the matching LOOP_END
      let loopBlock: CommandType[] = [];
      let j = i + 1;
      let balance = 1;
      
      while (j < commands.length) {
        if (commands[j] === CommandType.LOOP_START) balance++;
        if (commands[j] === CommandType.LOOP_END) balance--;
        
        if (balance === 0) {
          break;
        }
        loopBlock.push(commands[j]);
        j++;
      }

      // If we found a valid end
      if (balance === 0) {
        // Check for multiplier immediately after LOOP_END
        let multiplier = 1; // Default if no number card
        let skipNext = false;
        
        if (j + 1 < commands.length) {
            const nextToken = commands[j + 1];
            if (nextToken === CommandType.X2) {
                multiplier = 2;
                skipNext = true;
            } else if (nextToken === CommandType.X3) {
                multiplier = 3;
                skipNext = true;
            }
        }

        // Recursively compile the inner block
        const compiledInner = compileCommands(loopBlock);
        
        // Add to result N times
        for (let k = 0; k < multiplier; k++) {
          result.push(...compiledInner);
        }

        // Advance index: current loop start (i) to loop end (j) + potential multiplier
        i = j + (skipNext ? 2 : 1);
      } else {
        // Broken loop (no end), just ignore start
        i++;
      }
    } else if (cmd === CommandType.LOOP_END || cmd === CommandType.X2 || cmd === CommandType.X3) {
      // These should have been consumed by the loop logic or the single command logic below.
      // If they appear here, it means they are orphaned (e.g. "X2" at the very start), so we skip them.
      i++; 
    } else {
      // Regular movement command (FORWARD, BACKWARD, LEFT, RIGHT)
      // Check if the NEXT command is a multiplier
      let multiplier = 1;
      let skipNext = false;

      if (i + 1 < commands.length) {
        const next = commands[i + 1];
        if (next === CommandType.X2) {
            multiplier = 2;
            skipNext = true;
        } else if (next === CommandType.X3) {
            multiplier = 3;
            skipNext = true;
        }
      }

      // Push the command N times
      for (let k = 0; k < multiplier; k++) {
        result.push(cmd);
      }

      // Advance index
      i += (skipNext ? 2 : 1);
    }
  }

  return result;
};