import type {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/medusa"
import { DeepPartial, EntityManager } from "typeorm"
import EmailTemplate from "../../../models/email-template"
import { Client as PostmarkClient } from 'postmark';
import { CreateEmailTemplateResponse, GetEmailTemplatesRequest, GetEmailTemplatesResponse } from "src/types/email-template";


export const GET = async (
    req: GetEmailTemplatesRequest,
    res: GetEmailTemplatesResponse
) => {
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)
    res.json({
        templates: await emailTemplateRepo.find(),
    })
}

interface CreateEmailTemplateRequest extends MedusaRequest {
    body: {
        template: DeepPartial<EmailTemplate>
    }
}

/** 
 * POST /admin/email-templates
 * 
 * Creates a new email template.
 * 
 * Request body:
 * - template: Partial<EmailTemplate>
 */
export const POST = async (
    req: CreateEmailTemplateRequest,
    res: CreateEmailTemplateResponse
) => {
    const manager: EntityManager = req.scope.resolve("manager")
    const emailTemplateRepo = manager.getRepository(EmailTemplate)
    const newTemplate = emailTemplateRepo.create(req.body['template'])

    const postmarkClient = new PostmarkClient(process.env.POSTMARK_SERVER_TOKEN);
    const result = await postmarkClient.createTemplate({
        Alias: newTemplate.alias,
        Name: newTemplate.name,
        TextBody: "placeholder",
        Subject: newTemplate.subject,
    });
    newTemplate.postmark_id = result.TemplateId
    await emailTemplateRepo.save(newTemplate)

    res.json({
        alias: (await emailTemplateRepo.findOneByOrFail({ name: newTemplate.name })).alias,
    })
}