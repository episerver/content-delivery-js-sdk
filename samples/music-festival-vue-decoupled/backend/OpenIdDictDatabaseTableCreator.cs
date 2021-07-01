using System;
using System.Threading;
using System.Threading.Tasks;
using EPiServer.Data.Providers.Internal;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace MusicFestival.Backend
{
    public class OpenIdDictDatabaseTableCreator : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OpenIdDictDatabaseTableCreator> _logger;

        public OpenIdDictDatabaseTableCreator(
            IServiceProvider serviceProvider,
            ILogger<OpenIdDictDatabaseTableCreator> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();

            // Create database tables regardless if the database is empty or not.
            var dbContext = scope.ServiceProvider.GetRequiredService<OpenIDConnectDbContext>();
            var databaseCreator = dbContext.GetService<IRelationalDatabaseCreator>();
            try
            {
                await databaseCreator.CreateTablesAsync();
            }
            catch (SqlException ex)
            {
                // OpenIddict schema exists
                if (ex.Number == 2714)
                {
                    _logger.LogDebug("--- OpenIddict schema was already existed ! ");
                }
                else
                {
                    throw;
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }

    internal class OpenIDConnectDbContext : DbContext
    {
        private readonly IDatabaseConnectionResolver _databaseConnectionResolver;

        public OpenIDConnectDbContext()
        {
        }

        public OpenIDConnectDbContext(DbContextOptions<OpenIDConnectDbContext> options, IDatabaseConnectionResolver databaseConnectionResolver) : base(options)
        {
            _databaseConnectionResolver = databaseConnectionResolver;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _databaseConnectionResolver.Resolve().ConnectionString;
            optionsBuilder.UseSqlServer(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.UseOpenIddict();
        }
    }
}
