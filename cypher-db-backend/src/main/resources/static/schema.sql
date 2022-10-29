-- TRUNCATE TABLE public.graph_meta;
-- TRUNCATE TABLE public.graph_meta_node;
-- TRUNCATE TABLE public.graph_meta_edge;
-- TRUNCATE TABLE public.graph_meta_snapshot;
--
-- SELECT * FROM public.graph_meta;
-- SELECT * FROM public.graph_meta_node;
-- SELECT * FROM public.graph_meta_edge;
-- SELECT * FROM public.graph_meta_snapshot;

DROP TABLE public.graph_meta CASCADE;
DROP TABLE public.graph_meta_node CASCADE;
DROP TABLE public.graph_meta_edge CASCADE;
DROP TABLE public.graph_meta_snapshot CASCADE;

/**
    graph meta setting moment capture
 */
CREATE TABLE public.graph_meta_snapshot (
    type text NOT NULL PRIMARY KEY,
    nodes json,
    edges json,
    edge_labels json
);


/**
    graph meta node table
 */
CREATE TABLE public.graph_meta_node (
    type text NOT NULL,
    label text NOT NULL
);

/**
    graph meta edge table
 */
CREATE TABLE public.graph_meta_edge (
    type text NOT NULL,
    label text NOT NULL
);

/**
    graph meta table for linked nodes
 */
CREATE TABLE public.graph_meta (
    type text NOT NULL,
    source_label text NOT NULL,
    target_label text NOT NULL,
    edge_label text NOT NULL
);


