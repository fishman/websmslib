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
 *	example.conf.js
 *
 *	This is a sample plugin template to create your very own plugin.
 *	Please send it back to <emeraldion@emeraldion.it> with the subject
 *	"WebSMS <your service name here> Plugin", or submit it to the mailing list
 *	<websms@googlegroups.com> if you want it to be included in the original
 *	distribution.
 *
 */

/**
 *	Here you are adding your plugin to the plugins list.
 *	Use a unique name, to avoid overwriting other plugins :)
 *	For the regexp lovers, the allowed names are [a-z]([a-z0-9\-])+
 *	This should also be the name of the file before .conf.js
 *
 *	Recommended names should be the name of the carrier, a dash '-'
 *	then the ISO country code (e.g. 'it', 'fr' etc.).
 */

Plugins["example"] = {

	/**
	 *	Enter a descriptive name here
	 */

	name: "Example",

	/**
	 *	A version number in the form X.Y.Z; it will be used for versioning and
	 *	software updates.
	 */
	
	version: "0.1",

	/**
	 *	Enter the maximum number of chars allowed per message
	 */

	max_message_length: 999,

	/**
	 *	Enter a regular expression to identify without any doubt that a message
	 *	has been successfully sent. This is typically a message saying
	 *	"Yeah, message sent!" or the like...
	 */

	success_marker: /<span class="success">Bingo! Message sent!<\/span>/i,

	/**
	 *	The charset property is used to decode response text before using it.
	 *	WebSMS uses UTF-8 internally, so if the response is already encoded in UTF-8
	 *	this directive can be omitted.
	 */
	
	charset: 'iso-8859-1',
	
	/**
	 *	The steps array is an ordered list of page requests. You may need to
	 *	perform authorization and visit one or more intermediate pages before
	 *	being able to actually send the message. Uneasy stuff...
	 */

	steps: [

		/**
		 *	Every step has the following properties:
		 *
		 *	action
		 *		this is the URL of the page to be visited. Enter parameters in
		 *		an optional query string if the page requires parameters sent with GET.
		 *	referrer
		 *		(optional) this is the URL of the page that refers the action. Use only if
		 *		the service checks for the validity of referrer URLs.
		 *	data
		 *		(optional) an ordered list of pairs key=value, separated by ampersands (&);
		 *		these are the parameters sent with POST to the action page. If the request
		 *		uses the GET method, you can omit it.
		 *	flags
		 *		if you know how to use curl, you will be familiar with these options.
		 *		Default flags are:
		 *		-L		Automatically follow redirections issued by the server.
		 *		-s		Do not output progress information.
		 *
		 *	You can use some advanced features when needed. With some luck, you won't need those.
		 *
		 *	captcha
		 *		this is the (optional) URL of a Captcha image (i.e., those weird images that
		 *		present a code to the user, requesting to prove him to be a human).
		 *	check
		 *		an array of pairs {regexp, reason}. Think of this as a list of assertions that
		 *		the current step response has to satisfy in order to proceed. If one of these
		 *		conditions is NOT met, the sending will be aborted and the corresponding reason
		 *		will be reported to the user
		 *	vars
		 *		an array of pairs {regexp, name} to extract variables from webpages. They will be
		 *		available thereafter as replacements in URLs as placeholders. Be sure not to overwrite
		 *		standard placeholders. You should use your plugin name as a prefix 	(e.g. EXAMPLE_MY_VAR)
		 *	cookies
		 *		an array of pairs {cookie_name, cookie_value} to send to the server. They will
		 *		override any other cookie propagated before that point, so use with caution.
		 *	availabilityCheck
		 *		a function that accepts the response text as a parameter, and returns
		 *		the number of messages that will be available AFTER a successful sending.
		 *		This means that, if the response contains the indication "You have 5 messages left"
		 *		before composing a message, you will return 4. If this indication is presented after
		 *		sending a message, you will return 5.
		 *		Place this in a step whose response contains this information (e.g. in the composer).
		 *
		 *	You can use the following standard placeholders along the URLs; they will be
		 *	dinamically replaced with the corresponding values at runtime
		 *
		 *	%USERNAME%		username of the service.
		 *	%PASSWORD%		password of the service.
		 *	%FROM%			sender's sign, url-encoded. You would probably append it to the %TEXT%.
		 *	%U_FROM%		sender's sign, not url-encoded.
		 *	%E_FROM%		sender's sign, url-encoded twice (should you need that).
		 *	%CCODE%			sender's international country code (as set by the International preference pane).
		 *	%TO%			recipient's phone number, without country code.
		 *	%TO_CCODE%		recipient's country code.
		 *	%TEXT%			message text, url-encoded.
		 *	%U_TEXT%		message text, not url-encoded.
		 *	%E_TEXT%		message text, url-encoded twice (should you need that).
		 *	%TO_PREFIX%		recipient's phone prefix (first 3 cyphers of the number after country code).
		 *	%TO_NUMBER%		recipient's phone number, after removing TO_PREFIX.
		 *	%TO_US_AREACODE%	recipient's US area code (same as TO_PREFIX).
		 *	%TO_US_PREFIX%		recipient's US phone prefix (3 cyphers after area code).
		 *	%TO_US_NUMBER%		recipient's US phone number (cyphers following area code and prefix).
		 *	%CAPTCHA%		captcha code entered by user.
		 *
		 *	Remember that you can always define your own variables.
		 *
		 */

		{
			referrer: "http://my.message-sending-service.com",
			action: "http://my.message-sending-service.com/login.html",
			data: "password=%PASSWORD%&username=%USERNAME%",
			flags: "-L -s",
			availabilityCheck: function(__text)
			{
				/**
				 *	Here we extract the number of messages left from the response.
				 *	You may want to return the value diminished by one, as this will
				 *	be reported to the user AFTER the current message has been sent.
				 */

				return __text.match(/You have (\d+) messages left/)[1] - 1;
			},

			/**
			 *	If the webpage satisfies the following regular expression(s), the
			 *	sending will be aborted and the reason reported.
			 */
			check: [
				{
					match: /There are no messages left today/i,
					reason: "No SMS left"
				}],

			/**
			 *	You can extract precious information from webpages using a vars section;
			 *	the following regexp extracts a session ID from the current response:
			 */
			vars: [
				{
					/**
					 *	A regular expression that will be matched against the response.
					 *	
					 *	Global regexp's will extract an array of results.
					 */

					match: /sessionID="([a-z0-9]+)"/i,

					/**
					 *	The name of the variable. Use a unique name, to avoid overwriting
					 *	other variables. This variable will then be available to be replaced
					 *	in URLs and post data sections.
					 */

					name: "EXAMPLE_SESSION_ID",
					
					/**
					 *	Regexp index of the pattern to extract. Default is 1.
					 *	You can omit it in the above example.
					 */
					
					index: 1,

					/**
					 *	By default, variables are escaped to be used in URLs.
					 *	You can request to skip escaping by using escape: false.
					 *	By default, escape is true.
					 */
					
					escape: true
				}],

			/**
			 *	If you need to pass some cookies, use the cookies section;
			 *	beware: these cookies will override the ones propagated during the steps.
			 *	This can be useful to do some nasty tricks (e.g. to introduce cookies set in code).
			 */			
			cookies: [
				{
					name: "BrowserDetect",
					value: "passed"
				}]

		},
		
		/**
		 *	Add other steps (or remove unnecessary) if needed here...
		 */
		
		{
			captcha: "http://my.message-sending-service.com/captcha.jpg",
			referrer: "http://my.message-sending-service.com/login.html",

			/**
			 *	You can use previously defined variables in URLs: they will be
			 *	automatically substituted. Here we are using the session ID
			 */
			
			action: "http://my.message-sending-service.com/send.html?sessionID=%EXAMPLE_SESSION_ID%",
			
			/**
			 *	A good practice is to let the signature (%FROM%) follow the text, separated by a space
			 *	(%20), although this is not required. The following would be good as well:
			 *
			 *	data: "recipient=%TO%&text=%TEXT%",
			 */
			
			data: "recipient=%TO%&text=%TEXT%%20%FROM%",
			flags: "-L -s"
		}
	]
};