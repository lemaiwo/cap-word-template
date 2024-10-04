using my.bookshop as my from '../db/schema';

service CatalogService {
    @readonly entity Books as projection on my.Books;
    entity WordTemplate                                 as projection on my.WordTemplate;
    
    entity WordAttachments {
        key templateId : Integer;
            content    : LargeBinary @Core.MediaType : mediaType; //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            mediaType  : String      @Core.IsMediaType;
    }
}
