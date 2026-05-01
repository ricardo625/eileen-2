<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React + Vite + React Router v7 (declarative mode) project. PostHog is now initialized in `src/main.tsx` with the `PostHogProvider` and `PostHogErrorBoundary` wrapping the entire app, enabling automatic session recording, error capture, and pageview tracking. Ten business-critical events were instrumented across five files, with special emphasis on the shared link acknowledgment funnel — the primary conversion flow where external store managers review and acknowledge shelf audit submissions.

| Event | Description | File |
|---|---|---|
| `shared_link_viewer_identified` | Viewer enters their name in the dialog on a shared submission link — marks the start of the acknowledgment funnel. Also calls `posthog.identify()` to associate the user. | `src/pages/SharedLink.tsx` |
| `shared_link_acknowledged` | Viewer clicks the Acknowledged button on a shared submission link — primary conversion event for the shared link flow | `src/pages/SharedLink.tsx` |
| `action_item_toggled` | Viewer checks or unchecks an action item on a shared submission link, with `item_label` and `checked` properties | `src/pages/SharedLink.tsx` |
| `submission_share_link_copied` | User copies the shareable submission URL from the Share dialog, with the `url` property | `src/components/ShareDialog.tsx` |
| `submission_pdf_exported` | User clicks the PDF export button in the Share dialog | `src/components/ShareDialog.tsx` |
| `submission_csv_exported` | User clicks the CSV export button in the Share dialog | `src/components/ShareDialog.tsx` |
| `campaign_opened` | User clicks on a campaign card in Campaign Hub, with `campaign_id`, `campaign_title`, and `campaign_status` properties | `src/pages/CampaignHub.tsx` |
| `campaign_created` | User clicks New Campaign button in Campaign Hub | `src/pages/CampaignHub.tsx` |
| `campaign_tab_switched` | User switches between Overview, All Submissions, and Configuration tabs in Campaign Detail, with `tab` property | `src/pages/CampaignDetail.tsx` |
| `theme_toggled` | User toggles between light and dark mode, with `theme` property indicating the new theme | `src/App.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/404886/dashboard/1531176
- **Shared Link Acknowledgment Funnel**: https://us.posthog.com/project/404886/insights/Qwg6o0D6
- **Submission Exports (PDF & CSV)**: https://us.posthog.com/project/404886/insights/55eYvjxt
- **Campaign Activity**: https://us.posthog.com/project/404886/insights/ZdW6CS2f
- **Share Link Copies**: https://us.posthog.com/project/404886/insights/dUrS3mon
- **Action Item Completion on Shared Links**: https://us.posthog.com/project/404886/insights/xC0rhZTT

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
