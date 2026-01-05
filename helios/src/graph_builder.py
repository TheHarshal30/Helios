import networkx as nx


def build_graph(triplet_map: dict):
    G = nx.DiGraph()

    for source_name, triplets in triplet_map.items():
        for h, r, t in triplets:
            G.add_edge(h, t, relation=r, source=source_name)

    return G
