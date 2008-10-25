/**
 *	WebSMS widget
 *
 *	© Claudio Procida 2006-2008
 *
 *	Disclaimer
 *
 *	The WebSMS Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not its author(s), assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 */

/**
 *	smb.conf.js
 *
 *	© Claudio Procida 2008
 *
 *	WebSMS plugin for SMB net send messages
 *
 *	This plugin allows you to send messages to Windows machines running the
 *	Messenger service. The message will popup in the receiver's desktop.
 *	Put the Netbios name of the target machine in the To: field (e.g. DELLPC2800).
 *
 *	Changelog
 *	---------
 *	2008-03-08	First release.
 *
 */

Plugins["smb"] = {
	name: "SMB Net Send",
	version: "0.1",
	max_message_length: 255,
	success_marker: /Status: 0/i,
	transport: 'smb',
	steps: [
		{
			action: "%TO%",
			data: "%U_TEXT% %FROM%"
		}
	]
};