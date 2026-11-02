-- READ ONLY. Execute via Supabase SQL editor/MCP. Export manifest_json to a private local JSON file.
-- Never commit the output: it contains private Storage object names and metadata.
WITH objects AS (
 SELECT o.bucket_id AS bucket, o.name AS path, o.metadata,
   (a.id IS NOT NULL) AS registered,
   EXISTS(SELECT 1 FROM public.content_blocks b JOIN public.sections s ON s.id=b.section_id
     WHERE b.status='published' AND s.status='published' AND s.is_visible
     AND position('/storage/v1/object/public/portfolio-public/' || o.name IN b.content_json::text)>0
     AND o.bucket_id='portfolio-public') AS current_published,
   EXISTS(SELECT 1 FROM public.content_blocks b
     WHERE position(o.name IN b.content_json::text)>0) AS any_block,
   EXISTS(SELECT 1 FROM public.content_revisions r
     WHERE position(o.name IN r.snapshot_json::text)>0) AS in_revisions,
   EXISTS(SELECT 1 FROM public.site_settings ss
     WHERE position(o.name IN ss.seo_json::text)>0) AS in_seo,
   EXISTS(SELECT 1 FROM storage.objects other
     WHERE other.bucket_id<>o.bucket_id
       AND other.bucket_id IN ('portfolio-public','portfolio-private')
       AND other.name=o.name AND other.metadata->>'size'=o.metadata->>'size'
       AND other.metadata->>'eTag'=o.metadata->>'eTag') AS same_meta_pair
 FROM storage.objects o
 LEFT JOIN public.media_assets a ON a.storage_bucket=o.bucket_id AND a.storage_path=o.name
 WHERE o.bucket_id IN ('portfolio-public','portfolio-private')
)
SELECT jsonb_build_object(
 'version',1,
 'projectRef','zfnrhzplwpjpdljraypt',
 'items',coalesce(jsonb_agg(jsonb_build_object(
   'bucket',bucket,'path',path,'registered',registered,
   'currentPublished',current_published,'anyBlock',any_block,
   'inRevisions',in_revisions,'inSeo',in_seo,'sameMetaPair',same_meta_pair,
   'size',coalesce(nullif(metadata->>'size','')::bigint,0)
 ) ORDER BY bucket,path),'[]'::jsonb)
) AS manifest_json
FROM objects;
