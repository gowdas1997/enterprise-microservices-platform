using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using cartservice;

CreateHostBuilder(args).Build().Run();

static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
            webBuilder.UseUrls("http://0.0.0.0:7070");
        });