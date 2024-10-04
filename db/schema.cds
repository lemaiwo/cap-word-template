namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}

entity WordTemplate {
    key templateId     : Integer;
    name:String(100);
    filename:String(250);
    content   : LargeBinary @Core.MediaType: mediaType;//'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    mediaType:String @Core.IsMediaType;
}