import EmailEditor from 'react-email-editor'
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminCustomQuery, useAdminCustomPost } from 'medusa-react';
import { GetEmailTemplateRequestBody, GetEmailTemplateResponseBody, NotificationEvent, UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody } from '../../../../../types/email-template';
import { debounce } from 'lodash';
import EmailTemplate from '../../../../../models/email-template';


const EmailTemplateEditorPage = () => {
    const { alias } = useParams();
    const { data, isLoading } = useAdminCustomQuery<GetEmailTemplateRequestBody, GetEmailTemplateResponseBody>(
        `/admin/email-templates/${alias}`,
        [alias],
        {
            alias: alias,
        }
    );

    return (
        <div>
            {isLoading && <span>Loading...</span>}
            {data?.template && (
                <EmailTemplateEditor template={data.template} available_events={data.available_events} />
            )}
        </div>
    );
};

export default EmailTemplateEditorPage

const EmailTemplateEditor = (props: { template: EmailTemplate, available_events: string[] }) => {
    const { template, available_events } = props;
    const emailEditorRef = useRef(null);

    const [selectedEvent, setSelectedEvent] = useState(template.notification_event);
    const [subject, setSubject] = useState(template.subject ?? "");

    useEffect(() => {
        save();
    }, [selectedEvent, subject]);

    const { mutate, status } = useAdminCustomPost<UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody>(
        `/admin/email-templates/${template.alias}`,
        [template.alias],
    );

    const save = debounce(() => {
        emailEditorRef.current.editor.exportHtml((data) => {
            const { design, html } = data;
            mutate({
                template: {
                    alias: template.alias,
                    json_template: design,
                    html_body: html,
                    notification_event: selectedEvent,
                    subject: subject,
                }
            });
        });
    }, 1000);

    const onLoad = () => {
        emailEditorRef.current.editor.loadDesign(template.json_template);
        setSelectedEvent(template.notification_event);
    };

    const onReady = () => {
        emailEditorRef.current.editor.addEventListener('design:updated', (design) => {
            save();
        });
    };

    return (
        <div>
            <div>
                <label htmlFor="event-selector">Notification event</label>
                <select
                    name="Notification Event Selector"
                    id="event-selector"
                    value={selectedEvent ?? "unset"}
                    onChange={(event) => setSelectedEvent(event.target.value as NotificationEvent)}
                >
                    {available_events.map((event) => (
                        <option key={event} value={event}>{event}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="subject-input">Subject</label>
                <input
                    id="subject-input"
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                />
            </div>
            <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
                onReady={onReady}
                minHeight={window.innerHeight - 150}
                options={{
                    displayMode: 'email',
                    mergeTags: {},
                    user: {},
                    features: {
                        sendTestEmail: true,
                    }
                }}
            />
        </div>
    )
}
