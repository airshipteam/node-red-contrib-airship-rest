### 1.4.0 : Payload consistency / Validation (10-12-2021)
- Added the ability to receive `msg.payload.contact` besides `msg.payload.body` (backwards compatible)
- Added basic validation when using `msg.payload.contact`: Check if there's useful contact data before creating the contact, `msg.contact.email`/ `msg.contact.mobile_number` fields validation and `discard_invalid_rules` option.
- Added CHANGELOD.md, updated README.md, updated Node-RED help info
- Added example flow on README.md