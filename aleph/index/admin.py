import logging
from elasticsearch.exceptions import NotFoundError

from aleph.core import es, es_index
from aleph.index.mapping import TYPE_DOCUMENT, DOCUMENT_MAPPING
from aleph.index.mapping import TYPE_RECORD, RECORD_MAPPING
from aleph.index.mapping import TYPE_ENTITY, ENTITY_MAPPING
from aleph.index.mapping import TYPE_COLLECTION, COLLECTION_MAPPING
from aleph.index.mapping import TYPE_LEAD, LEAD_MAPPING
from aleph.index.mapping import TYPE_LINK, LINK_MAPPING

from aleph.index.util import query_delete

log = logging.getLogger(__name__)


def init_search():
    log.info("Creating ElasticSearch index and uploading mapping...")
    es.indices.create(es_index, body={
        'mappings': {
            TYPE_COLLECTION: COLLECTION_MAPPING,
            TYPE_DOCUMENT: DOCUMENT_MAPPING,
            TYPE_RECORD: RECORD_MAPPING,
            TYPE_ENTITY: ENTITY_MAPPING,
            TYPE_LINK: LINK_MAPPING,
            TYPE_LEAD: LEAD_MAPPING
        }
    }, ignore=[404, 400])
    es.indices.open(index=es_index, ignore=[400, 404])


def upgrade_search():
    """Add any missing properties to the index mappings."""
    try:
        es.indices.put_mapping(index=es_index, body=COLLECTION_MAPPING, doc_type=TYPE_COLLECTION)  # noqa
        es.indices.put_mapping(index=es_index, body=DOCUMENT_MAPPING, doc_type=TYPE_DOCUMENT)  # noqa
        es.indices.put_mapping(index=es_index, body=RECORD_MAPPING, doc_type=TYPE_RECORD)  # noqa
        es.indices.put_mapping(index=es_index, body=ENTITY_MAPPING, doc_type=TYPE_ENTITY)  # noqa
        es.indices.put_mapping(index=es_index, body=LINK_MAPPING, doc_type=TYPE_LINK)  # noqa
        es.indices.put_mapping(index=es_index, body=LEAD_MAPPING, doc_type=TYPE_LEAD)  # noqa
        log.info("Upgraded ElasticSearch index mapping.")
        delete_doc_type('record')
    except NotFoundError:
        log.info("Cannot upgrade search index, trying to create it...")
        init_search()


def delete_index():
    es.indices.delete(es_index, ignore=[404, 400])


def delete_doc_type(doc_type):
    query_delete({'match_all': {}}, doc_type=doc_type, wait=False)


def flush_index():
    """Run a refresh to apply all indexing changes."""
    es.indices.refresh(index=es_index)
