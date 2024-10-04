
const cds = require('@sap/cds');
const wordTemplate = require("easy-template-x");
const { Readable } = require('stream');
const path = require("path");
const fs = require('fs');

module.exports = (srv) => {
    const {WordTemplate} = cds.entities("my.bookshop");
    srv.on('READ', 'WordAttachments', async (req, next) => {
        try {
            const stream2buffer =(stream)=>{

                return new Promise((resolve, reject) => {
                    
                    const _buf = [];
            
                    stream.on("data", (chunk) => _buf.push(chunk));
                    stream.on("end", () => resolve(Buffer.concat(_buf)));
                    stream.on("error", (err) => reject(err));
            
                });
            } ;
            // const tx = cds.transaction(req);
            const tx = cds.tx(req);
            const templateId = req.data.templateId;

            const templates = await tx.run(SELECT.columns('templateId','content').from(WordTemplate).where({ templateId: templateId }));
            if (templates.length === 0) {
                return req.reject(404, 'No template found for templateid:' + templateId);
            }
            // const templateContent = await new Response(templates[0].content).blob();
            const templateContent = await stream2buffer(templates[0].content);
            let wordData = {prop1:"hello world!",
                    image1: {
                        _type: "image",
                        source: fs.readFileSync(path.resolve(__dirname, "./img/hero.jpg")),
                        format: "image/jpeg",
                        width: 200,
                        height: 200
                    }
            };
            
            
            const handler = new wordTemplate.TemplateHandler();
            const doc = await handler.process(templateContent, wordData);
            const readableInstanceStream = new Readable({
                read() {
                    this.push(doc);
                    this.push(null);
                }
            });
            const filename = 'test.docx';
            req._.res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            req._.res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            return {
                value: readableInstanceStream
            };
        }
        catch (error) {
            console.error('Error in WordAttachments READ');
            return req.reject(403, error?.message || "Error in WordAttachments");
        }
    });
};
