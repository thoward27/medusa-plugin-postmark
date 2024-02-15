import EmailEditor from 'react-email-editor'
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminCustomQuery, useAdminCustomPost } from 'medusa-react';
import { GetEmailTemplateRequestBody, GetEmailTemplateResponseBody, NotificationEvent, UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody } from '../../../../../types/email-template';
import { debounce } from 'lodash';


const EmailTemplateEditor = () => {
    const { alias } = useParams();
    const emailEditorRef = useRef(null);

    const { data, isLoading } = useAdminCustomQuery<GetEmailTemplateRequestBody, GetEmailTemplateResponseBody>(
        `/admin/email-templates/${alias}`,
        [alias],
        {
            alias: alias,
        }
    );

    const { mutate, status } = useAdminCustomPost<UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody>(
        `/admin/email-templates/${alias}`,
        [alias],
    );
 
    const [selectedEvent, setSelectedEvent] = useState(data?.template.notification_event);
    useEffect(() => {
        if (selectedEvent !== data?.template.notification_event) {
            save();
        }
    }, [selectedEvent])

   const save = debounce(() => {
        emailEditorRef.current.editor.exportHtml((data) => {
            const { design, html } = data;
            console.log(selectedEvent)
            mutate({
                template: {
                    alias: alias,
                    json_template: design,
                    html_body: html,
                    notification_event: selectedEvent,
                }
            });
        });
    }, 1000);

    const onLoad = () => {
        emailEditorRef.current.editor.loadDesign(data.template.json_template);
        setSelectedEvent(data.template.notification_event);
    };

    const onReady = () => {
        emailEditorRef.current.editor.addEventListener('design:updated', (design) => {
            save();
        });
    };

    return (
        <div>
            {isLoading && <span>Loading...</span>}
            <div>
                <select
                    name="Notification Event Selector"
                    id="event-selector"
                    value={selectedEvent ?? "unset"}
                    onChange={(event) => setSelectedEvent(event.target.value as NotificationEvent)}
                >
                    {data?.available_events.map((event) => (
                        <option key={event} value={event}>{event}</option>
                    ))}
                </select>
            </div>
            {data?.template && (
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
            )}
        </div>
    );
};

export default EmailTemplateEditor
