from functools import reduce
import yaml
from util import logger
import os

class QueryRepo():
    def __init__(self, ymlname=None):
        QueryRepoLog = logger.CommonLogger()
        QueryRepoLog.info(ymlname)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        #print(base_dir)
        if ymlname is None:
            yml_path = os.path.join(base_dir, 'yml', 'query.yaml')
            #print(yml_path)
            with open(yml_path, 'r') as stream:
                try:
                    self.queryRepo = yaml.safe_load(stream)
                except yaml.YAMLError as e:
                    QueryRepoLog.info(e)
        else:
            yml_path = os.path.join(base_dir, 'yml', ymlname)
            with open(yml_path,'r') as stream:
                try:
                    self.queryRepo = yaml.safe_load(stream)
                except yaml.YAMLError as e:
                    QueryRepoLog.info(e)

    def getQueryString(self,queryId):
        return reduce(lambda memo, key: memo[key], queryId.split('.'), self.queryRepo)