package dataspread.taco;

import dataspread.utils.ApiFormulaParser;
import dataspread.utils.Utils;

import org.apache.poi.ss.util.CellRangeAddress;
import java.io.IOException;

public class TacoService {

  public enum PatternType {
    RR_GAP_ONE,
    RR_CHAIN,
    UNKNOWN,
    NO_COMP,
    RR,
    RF,
    FR,
    FF,
  }

  private static boolean isRRPattern(CellRangeAddress prev, CellRangeAddress curr) {
    return
      curr != null && prev != null &&
      curr.getFirstColumn() != curr.getLastColumn() &&
      curr.getFirstRow() != curr.getLastRow() &&
      prev.getFirstColumn() != prev.getLastColumn() &&
      prev.getFirstRow() != prev.getLastRow() && 
      prev.getFirstColumn() == curr.getFirstColumn() &&
      prev.getLastColumn() == curr.getLastColumn() && 
      prev.getFirstRow() + 1 == curr.getFirstRow() &&
      prev.getLastRow() + 1 == curr.getLastRow();
  }

  private static boolean isRFPattern(CellRangeAddress prev, CellRangeAddress curr) {
    return 
      curr != null && prev != null &&
      prev.getFirstColumn() == curr.getFirstColumn() &&
      prev.getLastColumn() == curr.getLastColumn() && 
      prev.getFirstRow() + 1 == curr.getFirstRow() &&
      prev.getLastRow() == curr.getLastRow();
  }

  private static boolean isFRPattern(CellRangeAddress prev, CellRangeAddress curr) {
    return 
      curr != null && prev != null &&
      prev.getFirstColumn() == curr.getFirstColumn() &&
      prev.getLastColumn() == curr.getLastColumn() && 
      prev.getFirstRow() == curr.getFirstRow() &&
      prev.getLastRow() + 1 == curr.getLastRow();
  }

  private static boolean isFFPattern(CellRangeAddress prev, CellRangeAddress curr) {
    return 
      curr != null && prev != null &&
      prev.getFirstColumn() == curr.getFirstColumn() &&
      prev.getLastColumn() == curr.getLastColumn() && 
      prev.getFirstRow() == curr.getFirstRow() &&
      prev.getLastRow() == curr.getLastRow();
  }

  private static boolean isRRChainPattern(CellRangeAddress prev, CellRangeAddress curr) {
    return 
      curr != null && prev != null &&
      curr.getFirstColumn() == curr.getLastColumn() &&
      curr.getFirstRow() == curr.getLastRow() &&
      prev.getFirstColumn() == prev.getLastColumn() &&
      prev.getFirstRow() == prev.getLastRow() && 
      curr.getFirstColumn() == prev.getFirstColumn() && 
      curr.getFirstRow() == prev.getFirstRow() + 1;
  }

  private static void classifyPattern(CellRangeAddress[][] ranges, PatternType[][] patterns, int r, int c) {
    // The formula parser iterates over cells row by row, so when
    // this function is called, the cell above the current cell
    // and the cell directly to the left of the current cell have
    // already been visited and we know if they have exactly one
    // range or not.
    CellRangeAddress top = r - 1 >= 0 ? ranges[r - 1][c] : null;
    CellRangeAddress lft = c - 1 >= 0 ? ranges[r][c - 1] : null;
    CellRangeAddress cur = ranges[r][c];
    if (top != null && lft != null) {
      // If both the left and top cells have exactly one cell range
      // or cell reference, then we check if the current cell matches
      // the patterns in both the top and left cells. If they do, then
      // the current cell also follows the same pattern.
      if (
        TacoService.isRRPattern(top, cur) &&
        TacoService.isRRPattern(lft, cur)
      ) {
        patterns[r][c] = patterns[r - 1][c] = patterns[r][c - 1] = PatternType.RR;
      } else if (
        TacoService.isRFPattern(top, cur) &&
        TacoService.isRFPattern(lft, cur)
      ) {
        patterns[r][c] = patterns[r - 1][c] = patterns[r][c - 1] = PatternType.RF;
      } else if (
        TacoService.isFRPattern(top, cur)&&
        TacoService.isFRPattern(lft, cur)
      ) {
        patterns[r][c] = patterns[r - 1][c] = patterns[r][c - 1] = PatternType.FR;
      } else if (
        TacoService.isFFPattern(top, cur) &&
        TacoService.isFFPattern(lft, cur)
      ) {
        patterns[r][c] = patterns[r - 1][c] = patterns[r][c - 1] = PatternType.FF;
      } else if (
        TacoService.isRRChainPattern(top, cur) &&
        TacoService.isRRChainPattern(lft, cur)
      ) {
        patterns[r][c] = patterns[r - 1][c] = patterns[r][c - 1] = PatternType.RR_CHAIN;
      } else {
        // If both the top and left cells have exactly one cell range (or 
        // cell reference), but the current cell does not match the patterns 
        // in both the top and left cells, then we arbitrarily use the left 
        // cell for classification first. If there are no pattern matches, 
        // then the top cell is used next. If there are still no matches, 
        // then the cell is marked as incompressable.
        if (TacoService.isRRPattern(lft, cur)) {
          patterns[r][c] = patterns[r][c - 1] = PatternType.RR;
        } else if (TacoService.isRFPattern(lft, cur)) {
          patterns[r][c] = patterns[r][c - 1] = PatternType.RF;
        } else if (TacoService.isFRPattern(lft, cur)) {
          patterns[r][c] = patterns[r][c - 1] = PatternType.FR;
        } else if (TacoService.isFFPattern(lft, cur)) {
          patterns[r][c] = patterns[r][c - 1] = PatternType.FF;
        } else if (TacoService.isRRChainPattern(lft, cur)) {
          patterns[r][c] = patterns[r][c - 1] = PatternType.RR_CHAIN;
        } else if (TacoService.isRRPattern(top, cur)) {
          patterns[r][c] = patterns[r - 1][c] = PatternType.RR;
        } else if (TacoService.isRFPattern(top, cur)) {
          patterns[r][c] = patterns[r - 1][c] = PatternType.RF;
        } else if (TacoService.isFRPattern(top, cur)) {
          patterns[r][c] = patterns[r - 1][c] = PatternType.FR;
        } else if (TacoService.isFFPattern(top, cur)) {
          patterns[r][c] = patterns[r - 1][c] = PatternType.FF;
        } else if (TacoService.isRRChainPattern(top, cur)) {
          patterns[r][c] = patterns[r - 1][c] = PatternType.RR_CHAIN;
        } else {
          patterns[r][c] = PatternType.NO_COMP;
        }
      }
    } else if (top != null) {
      // If only the top cell has one cell range (or cell reference),
      // then we simply check for a pattern between it and the current
      // cell.
      if (TacoService.isRRPattern(top, cur)) {
        patterns[r][c] = patterns[r - 1][c] = PatternType.RR;
      } else if (TacoService.isRFPattern(top, cur)) {
        patterns[r][c] = patterns[r - 1][c] = PatternType.RF;
      } else if (TacoService.isFRPattern(top, cur)) {
        patterns[r][c] = patterns[r - 1][c] = PatternType.FR;
      } else if (TacoService.isFFPattern(top, cur)) {
        patterns[r][c] = patterns[r - 1][c] = PatternType.FF;
      } else if (TacoService.isRRChainPattern(top, cur)) {
        patterns[r][c] = patterns[r - 1][c] = PatternType.RR_CHAIN;
      } else {
        patterns[r][c] = PatternType.NO_COMP;
      }
    } else if (lft != null) {
      // If only the left cell has one cell range (or cell reference),
      // then we simply check for a pattern between it and the current
      // cell.
      if (TacoService.isRRPattern(lft, cur)) {
        patterns[r][c] = patterns[r][c - 1] = PatternType.RR;
      } else if (TacoService.isRFPattern(lft, cur)) {
        patterns[r][c] = patterns[r][c - 1] = PatternType.RF;
      } else if (TacoService.isFRPattern(lft, cur)) {
        patterns[r][c] = patterns[r][c - 1] = PatternType.FR;
      } else if (TacoService.isFFPattern(lft, cur)) {
        patterns[r][c] = patterns[r][c - 1] = PatternType.FF;
      } else if (TacoService.isRRChainPattern(lft, cur)) {
        patterns[r][c] = patterns[r][c - 1] = PatternType.RR_CHAIN;
      } else {
        patterns[r][c] = PatternType.NO_COMP;
      }
    } else {
      // At this point, both the top cell and left cell don't have exactly
      // one cell range (or cell reference), so we don't have enough info
      // to classify the current cell.
      patterns[r][c] = PatternType.UNKNOWN;
    }
  }
  
  /**
   * Given a matrix of Excel formula strings, find all the TACO patterns
   * in the matrix.
   *  
   * @param formulaMtx
   * @return A matrix of TACO patterns with the same shape as the input.
   * @throws IOException
   */
  public static PatternType[][] getPatterns(String[][] formulaMtx) throws IOException {
    PatternType[][] patterns = new PatternType[formulaMtx.length][formulaMtx[0].length];
    CellRangeAddress[][] ranges = new CellRangeAddress[formulaMtx.length][formulaMtx[0].length];
    ApiFormulaParser.parseFormulae(formulaMtx, (ptgs, i, j) -> {
      if (ptgs != null) {
        CellRangeAddress rng = Utils.hasExactlyOneCellRange(ptgs);
        CellRangeAddress ref = Utils.hasExactlyOneCellReference(ptgs);
        if (rng != null) {
          ranges[i][j] = rng;
        } else if (ref != null) {
          ranges[i][j] = ref;
        }
        TacoService.classifyPattern(ranges, patterns, i, j);
      }
    });
    return patterns;
  }

}
