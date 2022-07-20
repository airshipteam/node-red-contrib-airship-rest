### 2.0.3 : Monitor fixes (20-07-2022)
- Fixed a problem where the node would crash if no config property was set, now sends an error.
- Added more options so the node can get the integration_id and token
- Fixed the npm versioning
### 1.6.1 : Monitor output (30-05-2022)
- Added a third output that sends an object with the monitor/log node information
- Changed the error output to be the the third in the order, the second output is now the monitor one
- Changed some nomenclature such as `showError` to `sendError`
### 1.4.0 : Payload consistency / Validation (10-12-2021)
- Added the ability to receive `msg.payload.contact` besides `msg.payload.body` (backwards compatible)
- Added basic validation when using `msg.payload.contact`: Check if there's useful contact data before creating the contact, `msg.contact.email`/ `msg.contact.mobile_number` fields validation and `discard_invalid_rules` option.
- Added CHANGELOD.md, updated README.md, updated Node-RED help info
- Added example flow on README.md