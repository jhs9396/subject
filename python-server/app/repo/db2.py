import agensgraph as ag
from psycopg2 import pool
from util import logger
import psycopg2.extras
import repo
from decorator import contextmanager

class AgensGraphConn:
    __commonLogger = logger.CommonLogger()

    __dbconfig = repo.QueryRepo('config.yaml')
    __location = __dbconfig.getQueryString('project.location')

    isolation_opts = {
        "auto-commit": psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT,
        "read-committed": psycopg2.extensions.ISOLATION_LEVEL_READ_COMMITTED,
    }
    if __location == 'seoul':
        __pool = psycopg2.pool.ThreadedConnectionPool(__dbconfig.getQueryString('db.seoul.min_connection'),
                                                      __dbconfig.getQueryString('db.seoul.max_connection'),
                                                      host=__dbconfig.getQueryString('db.seoul.db_host'),
                                                      port=__dbconfig.getQueryString('db.seoul.db_port'),
                                                      database=__dbconfig.getQueryString('db.seoul.db_name'),
                                                      user=__dbconfig.getQueryString('db.seoul.db_user'))
    else:
        __pool = psycopg2.pool.ThreadedConnectionPool(__dbconfig.getQueryString('db.remote.min_connection'),
                                                    __dbconfig.getQueryString('db.remote.max_connection'),
                                                    host=__dbconfig.getQueryString('db.remote.db_host'),
                                                    port=__dbconfig.getQueryString('db.remote.db_port'),
                                                    database=__dbconfig.getQueryString('db.remote.db_name'),
                                                    user=__dbconfig.getQueryString('db.remote.db_user'))

    def __init__(self, isolation="auto-commit"):
        self.isolation_level = self.isolation_opts.get(isolation, psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)

    def __enter__(self):
        return self

    def setGraphPath(self, path):
        self.getConn().cursor().execute("SET GRAPH_PATH TO " + path)

    def getConn(self):
        try:
            __conn = self.__pool.getconn()
            #print('hello', __conn)
            __conn.set_isolation_level(self.isolation_level)

            if __conn:
                return __conn

        except psycopg2.pool.PoolError as e:
            self.__commonLogger.error(e)
            raise e
        except Exception as e:
            self.__commonLogger.error(e)
            raise e

    def doQuery(self, qry, params=None):
        con = self.getConn()
        with con.cursor() as curs:
            path = self.__dbconfig.getQueryString('db.'+self.__location+'.graph_path')
            """
            create graph init if graph is null
            """
            try:
                curs.execute("SET GRAPH_PATH TO " + path)
            except Exception, e:
                __script = repo.QueryRepo('ctiscript.yaml')
                curs.execute(__script.getQueryString('create.graph')+path)
                
            try:
                if params is not None:
                    curs.execute(qry, params)
                else:
                    curs.execute(qry)

                res = curs.fetchall()
                curs.close()
                return res
            except psycopg2.ProgrammingError as e:
                self.__commonLogger.error(e)
            except Exception, e:
                self.__commonLogger.error(e)
                raise e
            finally:
                self.__pool.putconn(con)