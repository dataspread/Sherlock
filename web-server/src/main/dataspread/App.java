package dataspread;

import static spark.Spark.*;
import spark.Filter;

import dataspread.formulas.FormulasController;
import dataspread.taco.TacoController;
import dataspread.utils.Controller;

/**
 * Entry point for the formula detection API.
 */
public class App {

  // Add more controllers here!
  public static Controller[] controllers = {
      new FormulasController(),
      new TacoController(),
  };

  public static void main(String[] args) {

    port(4567);

    before((Filter) (request, response) -> {
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Headers", "*");
      response.header("Access-Control-Allow-Methods", "*");
    });

    options("/*", (request, response) -> {

      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    after((Filter) (request, response) -> {
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Methods", "*");
      response.header("Access-Control-Allow-Headers", "*");
      response.header("Content-Encoding", "gzip");
    });

    path("/api", () -> {
      for (Controller c : App.controllers) {
        path(c.getPrefix(), c.getRoutes());
      }
    });

  }
}
