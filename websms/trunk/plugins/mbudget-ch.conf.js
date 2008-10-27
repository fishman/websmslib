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
 *	mbudget-ch.conf.js
 *
 *	© Michele Mazzucchi 2008-Today
 *
 *	WebSMS plugin for M-Budget -- http://www.migros.ch
 *
 *	Changelog
 *	---------
 *	2008-05-09	First release.
 *
 */

Plugins["mbudget-ch"] = {
	name: "M-Budget mobile",
	version: "1.0",
	max_message_length: Infinity,
	success_marker: /ResultText:OK/,
	charset: "iso-8859-1",
	steps: [
		{
			action: "http://www.company.ecall.ch/ecompurl/ECOMPURL.ASP?wci=Interface&Function=SendPage&Address=%TO%&Message=%TEXT%&LinkID=mbudget&UserName=%USERNAME%&UserPassword=%PASSWORD%&Language=IT" + Math.floor(Math.random()*16384),
			flags: "-s",
			check: [
				{
					match: /ResultCode:11100/,
					reason: "Invalid number. (non-swiss?)"
				},
				{
					match: /ResultCode:11300/,
					reason: "Login failed."
				},
				{
					match: /ResultCode:11301/,
					reason: "No SMS left."
				}
			]
		}
	]
};

