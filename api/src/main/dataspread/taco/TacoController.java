package dataspread.taco;

import static spark.Spark.*;

import dataspread.taco.TacoService.PatternType;
import dataspread.utils.Controller;
import dataspread.utils.Utils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.Gson;
import spark.RouteGroup;
import java.util.Map;

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
          return new Gson().toJson(Map.of("data", hMtx));
        } else {
          return new Gson().toJson(Map.of("data", new String[0]));
        }
      });
    };
  }
  
}
