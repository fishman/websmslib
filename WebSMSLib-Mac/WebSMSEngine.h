//
//  WebSMSEngine.h
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#ifdef TARGET_OS_MAC
	#import <Cocoa/Cocoa.h>
#endif
#ifdef IPHONE
	#import <Foundation/Foundation.h>
#endif

#import "WebSMSPlugin.h"
#import "WebSMSData.h"
#import "TransportClient.h"
#import	"AGRegex.h"


@class WebSMSEngine;
// You should to implement this protocol in your delegate class in order to be notified
// on connection and sending status (and if your plugin uses captcha you really need it!)
@protocol WebSMSEngine_Protocol
// notify delegate when sending process will starts
- (void) websms_startSendingProcess:(WebSMSEngine *) engine totalStages:(int) _stages;
// notify when sms was sent successfully to server
- (void) websms_sendingSucceded:(WebSMSEngine *) engine;
// something goes wrong, sms was not sent (-websms_sendingErrorOccurred:from: will sent multiple times based on checks data of plugin config)
- (void) websms_sendingFailed:(WebSMSEngine *) engine;
// delegate will receive this message one or more times (engine will check 'check' key - an array of conditions - at current stage)
- (void) websms_sendingErrorOccurred:(NSString *) error from:(WebSMSEngine *) engine;
// engine needs of interactive input. Captcha url is visible by loading url at captcha_src. When done call -send method to continue next stage
- (void) websms_requestCaptchaCode:(NSString *) captcha_src from:(WebSMSEngine *) engine;
// plugin config can allows you to get the number of remaining messages you can send. If available this method will report the value
- (void) websms_availableMessages:(int) num_msg from:(WebSMSEngine *) engine;
// connection is failed due to an error
- (void) websms_connectionFailedToServer:(NSString *) _error stageToProcess:(int) _stage from:(WebSMSEngine *) engine;
// connection established to server (to perform the given stage)
- (void) websms_connectionEstablishedFrom:(WebSMSEngine *) engine currentStageIs:(int) _stage;
// start performing stage x of total stage of sending process
- (void) websms_performedStage:(int) _cStep of:(int) _totalStage from:(WebSMSEngine *) engine;
// notify about abort command sent by user
- (void) websms_sendAborted:(WebSMSEngine *) engine;
// wrong server response. plugin could be bugged
- (void) websms_wrongResponseFromServerForURL:(NSString *) _url withMessage:(NSString *) _msg for:(WebSMSEngine *) engine;
// a required variable in this step is not available on downloaded page (something is changed into the site?)
// An unhandled exception (not the expected page but another, with an error? bad number format?) could also be raised
- (void) websms_missingVariable:(NSString *) _varName forStage:(int) _cStage pageContent:(NSString *) _data for:(WebSMSEngine *) engine;

- (void) websms_redirectingToPage:(NSString *) _urlPage;

@end

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
		 *		you can add a regexp to capture the value of remaining available messages from server.
		 *		WebSMS widget allow you to define here a function that accept the response text as a parameter;
		 *		unfortunatly in order to mantain compatibility with iPhone we can't (at this time) provide
		 *		a sort of javascript runtime. So the only solution is to make a regexp that return this value.
		 *
		 *	You can use the following standard placeholders along the URLs; they will be
		 *	dinamically replaced with the corresponding values at runtime
		 *
		 *	%USERNAME%			username of the service.
		 *	%PASSWORD%			password of the service.
		 *	%FROM%				sender's sign, url-encoded. You would probably append it to the %TEXT%.
		 *	%U_FROM%			sender's sign, not url-encoded.
		 *	%E_FROM%			sender's sign, url-encoded twice (should you need that).
		 *	%CCODE%				sender's international country code (as set by the International preference pane).
		 *	%TO%				recipient's phone number, without country code.
		 *	%TO_CCODE%			recipient's country code.
		 *	%TEXT%				message text, url-encoded.
		 *	%U_TEXT%			message text, not url-encoded.
		 *	%E_TEXT%			message text, url-encoded twice (should you need that).
		 *	%TO_PREFIX%			recipient's phone prefix (first 3 cyphers of the number after country code).
		 *	%TO_NUMBER%			recipient's phone number, after removing TO_PREFIX.
		 *	%TO_US_AREACODE%	recipient's US area code (same as TO_PREFIX).
		 *	%TO_US_PREFIX%		recipient's US phone prefix (3 cyphers after area code).
		 *	%TO_US_NUMBER%		recipient's US phone number (cyphers following area code and prefix).
		 *	%CAPTCHA%			captcha code entered by user.
		 *
		 *	Remember that you can always define your own variables.
		 *
		 */


@interface WebSMSEngine : NSObject <TransportClient_Delegate> {
	NSObject <WebSMSEngine_Protocol>*	_delegate;							// A delegate to manager user interactive input
	WebSMSPlugin*						_plugin;							// Plugin with configuration settings
	WebSMSData*							_objData;							// contains both auth data for plugin and message to send
	
	
	// PRIVATE DATA STRUCTURES
	int									_step;								// Current step in sending process
	NSTimer*							_timer;								// Timeout timer
	NSMutableDictionary*				_replacements;						// Replacements for placeholders in URLs
	BOOL								_shouldAbortSending;				// true if the engine should abort sending
	TransportClient*					_transportClient;					// Transport Client for HTTP operations	
	// captcha code support
	NSString*							_captchaCode;						// A code for the CAPTCHA image
	NSString*							_captchaSrc;						// A source for the CAPTCHA image
	BOOL								_enablePageWriteBack;				// write the current step page (for each step) content to disk
}

#pragma mark SETUP DATA
- (BOOL) setPlugin:(WebSMSPlugin *) _add_plugin;						// setup plugin for engine
- (void) setMessageData:(WebSMSData *) _data;							// set message data
- (void) setCaptchaCode:(NSString *) _code;								// call this with user provided string after -websms_requestCaptchaCode:from: was raised
- (BOOL) setDelegate:(NSObject <WebSMSEngine_Protocol>*) delegate;		// set engine delegate responser (must implement WebSMSEngine_Protocol protocol)

- (WebSMSPlugin *) getPlugin;											// get loaded plugin
- (WebSMSData *) getMessageData;										// get the message object data (auth + message)
- (void) setEnablePageWriteBack:(BOOL) _en;								// enable writeback; each downloaded page from server will written to disk for debug

#pragma mark ACTION
- (BOOL) send;															// start sending process
- (void) abort;															// send an abort command (connection will be interrupted when a new step is coming to queue)
- (void) abortNow;														// interrupt the connection now

- (NSDictionary *) replacements;

// you should not call private method!
#pragma mark PRIVATE
- (void) reset;															// (you should not use it)
- (AGRegexMatch *) _matchRegExp:(NSString *) _regexp toString:(NSString *) _source;
- (void) _performCaptchaRequest;
- (BOOL) _checkErrors:(NSString *) _response;
- (void) _extractVars:(NSString *) _response;
- (void) _checkSMSAvailability:(NSString *) _response;
- (BOOL) _captchaRequired;
- (void) _applySettingsFromMessageData;
- (void) _startTimeoutTimer;
- (void) _clearTimeoutTimer;
- (void) _prepareRequest;

@end
