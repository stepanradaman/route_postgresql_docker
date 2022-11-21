const db = require('../db');

class EdgesController {

    async getCoords(req, res) {
        const edges = await db.query('SELECT SUM(a.length)\n' +
            'FROM (\n' +
            '\tSELECT\n' +
            '\t MIN(r.seq) AS seq,\n' +
            '\t e.old_id AS id,\n' +
            '\t e.name,\n' +
            '\t e.type,\n' +
            '\t sum(e.distance) AS distance,\n' +
            '\t ST_Length(ST_Collect(e.the_geom)::geography) AS length,\n' +
            '\t ST_AsGeoJSON(ST_Collect(e.the_geom)) AS geom1\n' +
            '\tFROM pgr_dijkstra(\'SELECT id,source,target,distance AS cost \n' +
            '\t FROM edges_noded\',\n' +
            '\t\t\t\t\t  (SELECT\n' +
            '\t\t\t\t\t\t  v.id\n' +
            '\t\t\t\t\t\tFROM\n' +
            '\t\t\t\t\t\t  edges_noded_vertices_pgr AS v,\n' +
            '\t\t\t\t\t\t  edges_noded AS e\n' +
            '\t\t\t\t\t\tWHERE\n' +
            '\t\t\t\t\t\t  v.id = (SELECT\n' +
            '\t\t\t\t\t\t\t\t\tid\n' +
            '\t\t\t\t\t\t\t\t  FROM edges_noded_vertices_pgr\n' +
            '\t\t\t\t\t\t\t\t  ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint($1, $2), 4326) LIMIT 1)\n' +
            '\t\t\t\t\t\t  AND (e.source = v.id OR e.target = v.id)\n' +
            '\t\t\t\t\t\tGROUP BY v.id, v.the_geom)\n' +
            '\t\t\t\t\t  , \n' +
            '\t\t\t\t\t  (SELECT\n' +
            '\t\t\t\t\t\t  v.id\n' +
            '\t\t\t\t\t\tFROM\n' +
            '\t\t\t\t\t\t  edges_noded_vertices_pgr AS v,\n' +
            '\t\t\t\t\t\t  edges_noded AS e\n' +
            '\t\t\t\t\t\tWHERE\n' +
            '\t\t\t\t\t\t  v.id = (SELECT\n' +
            '\t\t\t\t\t\t\t\t\tid\n' +
            '\t\t\t\t\t\t\t\t  FROM edges_noded_vertices_pgr\n' +
            '\t\t\t\t\t\t\t\t  ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint($3, $4), 4326) LIMIT 1)\n' +
            '\t\t\t\t\t\t  AND (e.source = v.id OR e.target = v.id)\n' +
            '\t\t\t\t\t\tGROUP BY v.id, v.the_geom)\n' +
            '\t\t\t\t\t  ,false) AS r,edges_noded AS e \n' +
            '\tWHERE r.edge=e.id\n' +
            '\tGROUP BY e.old_id,e.name,e.type\n' +
            ') AS a', [req.body.sx, req.body.sy, req.body.tx, req.body.ty]);
        res.json(edges.rows);
    }
}

module.exports = new EdgesController();


