export default function(t){var o=SEMICOLON.Core;o.loadJS({file:"plugins.bootstrap.js",id:"canvas-bootstrap-js",jsFolder:!0}),o.isFuncTrue(()=>"undefined"!=typeof bootstrap).then(t=>{if(!t)return!1;SEMICOLON.Core.initFunction({class:"has-plugin-bootstrap",event:"pluginBootstrapReady"})})}