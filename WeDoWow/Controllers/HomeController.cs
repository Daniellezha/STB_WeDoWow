using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WeDoWow.Fabric;

namespace WeDoWow.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var userContext = Request.CreateVisitContext();

            return View(userContext);
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
