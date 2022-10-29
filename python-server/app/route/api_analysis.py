import sys

from app.util.enum import Properties
from app.util.router import router
from app.analysis.cluster_analysis import cluster_analysis

def clustering(req, next):
    instance = cluster_analysis.ClusterAnalysis({})
    nodes = dict()
    for node in req.get_json()['edges']:
        nodes[node['source']['id']] = node['source']
        nodes[node['target']['id']] = node['target']

    edges = [(edge['source']['id'], edge['target']['id']) for edge in req.get_json()['edges']]
    many_cluster = instance.runLouvainMethod(edges)

    transform_cluster = dict()
    for key, items in many_cluster.items():
        transform_cluster[str(key)] = [nodes[id]['name'] for id in items]

    return transform_cluster


router.post('/clustering', clustering)

sys.modules[__name__] = {
    Properties.ROUTER: router,
    Properties.MODULE: __name__
}