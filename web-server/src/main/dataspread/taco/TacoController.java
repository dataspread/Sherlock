package dataspread.taco;

import static spark.Spark.post;

import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import org.dataspread.sheetanalyzer.SheetAnalyzer;

import dataspread.taco.TacoService.PatternType;
import dataspread.utils.Controller;
import dataspread.utils.Utils;
import spark.RouteGroup;

public class TacoController implements Controller {

  @Override
  public String getPrefix() {
    return "/taco";
  }

  @Override
  public RouteGroup getRoutes() {
    return () -> {
      post("/patterns", (req, res) -> {
        JsonObject body = new Gson().fromJson(req.body(), JsonObject.class);
        JsonElement formulae = body.get("formulae");
        if (formulae != null) {
          JsonArray mtx = formulae.getAsJsonArray();
          String[][] fMtx = Utils.jsonMtxToStringMtx(mtx);
          PatternType[][] hMtx = TacoService.getPatterns(fMtx);

          Map<String, String[][]> spreadsheetContent = new HashMap<>();
          spreadsheetContent.put("default-sheet-name", fMtx);
          SheetAnalyzer sheetAnalyzer = SheetAnalyzer.createSheetAnalyzer(spreadsheetContent);

          return new Gson().toJson(Map.of("data", hMtx, "taco", sheetAnalyzer.getTACODepGraphs()));
        } else {
          return new Gson().toJson(Map.of("data", new String[0]));
        }
      });
    };
  }

}
