import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import EmailTemplate from "../models/email-template"

export type UpdateEmailTemplateRequestBody = {
    template: Required<Pick<EmailTemplate, "alias" | "json_template" | "html_body">> & Partial<EmailTemplate>
}

export interface UpdateEmailTemplateRequest extends MedusaRequest {
    body: UpdateEmailTemplateRequestBody
}

export type UpdateEmailTemplateResponseBody = {}

export interface UpdateEmailTemplateResponse extends MedusaResponse {
    body: UpdateEmailTemplateResponseBody
}

export interface UpdateEmailTemplateResponse extends MedusaResponse {
    body: UpdateEmailTemplateResponseBody
}

export type GetEmailTemplatesResponseBody = {
    templates: EmailTemplate[];
}

export interface GetEmailTemplatesResponse extends MedusaResponse {
    body: GetEmailTemplatesResponseBody
}

export type GetEmailTemplatesRequestBody = {}

export interface GetEmailTemplatesRequest extends MedusaRequest {
    body: GetEmailTemplatesRequestBody
}

export type GetEmailTemplateRequestBody = {
    alias: string;
}

export interface GetEmailTemplateRequest extends MedusaRequest {
    body: GetEmailTemplateRequestBody
}

export type GetEmailTemplateResponseBody = {
    template: EmailTemplate;
    available_events: string[];
}

export interface GetEmailTemplateResponse extends MedusaResponse {
    body: GetEmailTemplateResponseBody
}

export type CreateEmailTemplateRequestBody = {
    template: Required<Pick<EmailTemplate, "name" | "subject" | "html_body" | "json_template">> & Partial<EmailTemplate>;
}

export interface CreateEmailTemplateRequest extends MedusaRequest {
    body: CreateEmailTemplateRequestBody
}

export type CreateEmailTemplateResponseBody = {
    alias: string;
}

export interface CreateEmailTemplateResponse extends MedusaResponse {
    body: CreateEmailTemplateResponseBody
}

export enum NotificationEvent {
    UNSET = "unset",
    ORDER_PLACED = "order.placed",
    ORDER_CANCELLED = "order.cancelled",
    ORDER_SHIPMENT_CREATED = "order.shipment_created",
    CUSTOMER_CREATED = "customer.created",
    CUSTOMER_PASSWORD_RESET = "customer.password_reset",
    USER_CREATED = "user.created",
    USER_PASSWORD_RESET = "user.password_reset",
    AUTH_PASSWORD_RESET = "auth.password_reset",
    AUTH_VERIFY_ACCOUNT = "auth.verify_account",
    ACTIVITY_INACTIVE_USER = "activity.inactive_user",
    ACTIVITY_INACTIVE_CUSTOMER = "activity.inactive_customer",
}
