package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import scalaj.http._

@Singleton
class ApiController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  def lolicon(
    size: String = "regular",
    num: String = "1",
    r18: String = "0",
    args: String = "",
  ) = Action { implicit request: Request[AnyContent] => {
      val url = "https://api.lolicon.app/setu/v2"
      var qs = Map("size" -> size, "num" -> num)
      if (r18 == "1") {
        qs += ("r18" -> "1")
      }
      if (!args.isEmpty()) {
        qs += ("tag" -> args)
      }
      val response: HttpResponse[String] = Http(url).params(qs).asString
      Ok(Json.parse(response.body))
    }
  }
}
