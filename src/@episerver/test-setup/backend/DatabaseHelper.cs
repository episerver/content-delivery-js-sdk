using System.Data;
using Microsoft.Data.SqlClient;

namespace Backend;

internal static class DatabaseHelper
{
    #region SQL Scripts

    private const string ExistsDatabaseCommand = "SELECT COUNT(*) FROM sys.databases WHERE NAME=@dbName";

    private const string CreateDatabaseCommand = @"
IF NOT EXISTS (SELECT * FROM sys.databases WHERE NAME=@dbName)
BEGIN
	DECLARE @sql nvarchar(500);
	SET @sql = N'CREATE DATABASE ' + QUOTENAME(@dbName)
	EXECUTE sp_executesql @sql;
END
";

    private const string DropDatabaseCommand = @"
IF EXISTS (SELECT * FROM sys.databases WHERE NAME=@dbName)
BEGIN
	DECLARE @sql nvarchar(500);
	SET @sql = N'ALTER DATABASE ' + QUOTENAME(@dbName)  + ' SET SINGLE_USER WITH ROLLBACK IMMEDIATE
                 DROP DATABASE '+ QUOTENAME(@dbName)
	EXECUTE sp_executesql @sql;
END
";
    #endregion

    public static void Ensure(string connectionString)
    {
        if (!Exists(connectionString))
        {
            Create(connectionString);
        }
    }

    public static bool Exists(string connectionString)
    {
        // If we can get the database name we'll check the Master database as it's faster than trying to connect to non existing databases
        if (TryGetDatabaseName(connectionString, out string? databaseName))
        {
            try
            {
                using (var con = new SqlConnection(MasterConnectionString(connectionString)))
                {
                    con.Open();

                    using (var cmd = con.CreateCommand())
                    {
                        cmd.CommandText = ExistsDatabaseCommand;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        cmd.Parameters.Add(new SqlParameter { ParameterName = "dbName", Value = databaseName });

                        var masterCheck = Convert.ToInt32(cmd.ExecuteScalar());

                        return masterCheck == 1;
                    }
                }
            }
            catch (SqlException)
            {
                // TOOD: Check detailed exceptions here 
            }
        }

        // If we couldn't use the Master database, try connecting directly (slow!)
        try
        {
            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                return true;
            }
        }
        catch (SqlException ex)
        {
            // Login failed is thrown when the database does not exist
            if (ex.Number == 4060)
            {
                return false;
            }

            throw;
        }
    }

    public static void Create(string connectionString)
    {
        if (!TryGetDatabaseName(connectionString, out string? databaseName))
        {
            throw new ArgumentException($"Unabled to extract the database name from the provided connection string '{connectionString}'.");
        }

        using (var con = new SqlConnection(MasterConnectionString(connectionString)))
        {
            con.Open();
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = CreateDatabaseCommand;
                cmd.CommandType = CommandType.Text;
                cmd.CommandTimeout = 300;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "dbName", Value = databaseName });

                cmd.ExecuteNonQuery();
            }
        }

        // Clearing the connection pool seems to help avoid login errors directly after creation
        SqlConnection.ClearAllPools();
    }

    public static void Drop(string connectionString)
    {
        if (!TryGetDatabaseName(connectionString, out string? databaseName))
        {
            return;
        }

        SqlConnection.ClearAllPools();

        using (var con = new SqlConnection(MasterConnectionString(connectionString)))
        {
            con.Open();
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = DropDatabaseCommand;
                cmd.CommandType = CommandType.Text;
                cmd.CommandTimeout = 300;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "dbName", Value = databaseName });

                cmd.ExecuteNonQuery();
            }
        }

        SqlConnection.ClearAllPools();
    }

    public static IDisposable Temporary(string connectionString, bool throwIfExists = true, bool onlyDropIfCreated = true)
    {
        return new TemporaryDatabase(connectionString, throwIfExists, onlyDropIfCreated);
    }

    private static bool TryGetDatabaseName(string connectionString, out string? name)
    {
        var builder = new SqlConnectionStringBuilder(connectionString);

        if (!string.IsNullOrEmpty(builder.AttachDBFilename))
        {
            name = null;
            return false;
        }

        name = builder.InitialCatalog;
        return !string.IsNullOrWhiteSpace(name);
    }

    private static string MasterConnectionString(string connectionString)
    {
        return new SqlConnectionStringBuilder(connectionString) { InitialCatalog = "master" }.ConnectionString;
    }

    private class TemporaryDatabase : IDisposable
    {
        private readonly string _connectionString;
        private readonly bool _shouldDrop;

        public TemporaryDatabase(string connectionString, bool throwIfExists, bool onlyDropIfCreated)
        {
            _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));

            if (Exists(connectionString))
            {
                if (throwIfExists)
                {
                    throw new ArgumentException($"A database already exist for the provided connection '{connectionString}'.", nameof(connectionString));
                }

                _shouldDrop = !onlyDropIfCreated;
            }
            else
            {
                Create(connectionString);
                _shouldDrop = true;
            }
        }

        public void Dispose()
        {
            if (_shouldDrop)
            {
                Drop(_connectionString);
            }
        }
    }
}
