//
//  WebSMSEngine.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WebSMSEngine.h"
#import "WebSMSMessage.h"
#import "NSString_Extensions.h"
#import "MCDebug.h"
#import "WebSMSApp.h"

// Sending timeout interval (milliseconds)
// 30 seconds should be enough for anything
#define WEBSMSENGINE_SENDING_TIMEOUT	60000

@implementation WebSMSEngine

- (id) init
{
	self = [super init];
	if (self != nil) {
		_delegate = nil;
		_plugin	= nil;
		_step = 0;
		_timer = nil;
		_captchaCode = nil;
		_captchaSrc = nil;
		_shouldAbortSending = NO;

		_replacements = [[NSMutableDictionary alloc] init];
		_transportClient = [[TransportClient alloc] init];
		[_transportClient setDelegate: self];
	}
	return self;
}

- (NSDictionary *) replacements {
	return _replacements;
}

- (void) dealloc
{
	[_delegate release];
	[_plugin release];
	[_objData release];
	[_timer release];
	[_replacements release];
	[_transportClient release];
	[_captchaSrc release];
	[_captchaSrc release];
	[super dealloc];
}


- (void) abortNow {
	[_transportClient abort];
	_step = 0;
	_shouldAbortSending = NO;
	[_replacements release];
	_replacements = [[NSMutableDictionary alloc] init];
	[self _applySettingsFromMessageData];
}

/**
 *	@method abort
 *	@abstract Requests the abortion of the current sending.
 */
- (void) abort {
	_shouldAbortSending = YES;
}

- (void) setMessageData:(WebSMSData *) _data {
	[_objData release];
	_objData = [_data retain];
	
	// fillup settings
	[self _applySettingsFromMessageData];
}

/**
 *	@method setPlugin
 *	@abstract Configures the engine with the given plugin.
 *	@param plugin The plugin with configuration instructions.
 */
- (BOOL) setPlugin:(WebSMSPlugin *) _add_plugin {
	if (_add_plugin != nil) {
		// loading plugin
		[_plugin release];
		_plugin = [_add_plugin retain];
	} return NO; // failed to associate plugin
}

/**
 *	@method setCaptchaCode
 *	@abstract Provides the code for the current captcha image.
 *	@discussion This method should be called when the user has entered
 *	a captcha code, which has been previously requested with a call
 *	to <tt>requestCaptchaCode</tt> to the delegate.
 *	@param code The code for the current captcha.
 */
- (void) setCaptchaCode:(NSString *) _code {
	_step++;
	[_captchaCode release]; _captchaCode = [_code retain];
	[_replacements setObject: _code forKey:@"%CAPTCHA%"];
}

/**
 *	@method setDelegate
 *	@abstract Sets the delegate of the engine.
 *	@discussion The delegate should respond (but it is not required to)
 *	to the following methods:
 *
 *	sendingSucceeded()
 *	sendingFailed()
 *	sendingError(error)
 *	requestCaptchaCode(captcha_src)
 *	availableMessages(num_msg)
 *
 *	@param delegate The delegate object.
 */
- (BOOL) setDelegate:(NSObject <WebSMSEngine_Protocol> *) delegate {
	if ([delegate conformsToProtocol: @protocol(WebSMSEngine_Protocol)]) {
		[_delegate release];
		_delegate = [delegate retain];
		return YES;
	} return NO;
}

- (BOOL) send {
	if (_plugin == nil) {
		[_delegate websms_sendingErrorOccurred: @"You have forgot to specify a plugin using -setPlugin method" from:self];
		return NO;
	}
	
	if (_delegate == nil) {
		[_delegate websms_sendingErrorOccurred: @"You have forgot to specify a delegate class. Use -setDelegate method" from:self];
		return NO;
	}
	
	if (_step == 0) [_delegate websms_startSendingProcess: self totalStages: [_plugin steps]];
	
	_shouldAbortSending = NO;
	// prepare transportation layer
	[self _prepareRequest];
	
	// start timeout timer
	[self _startTimeoutTimer];
	
	// start!
	[_transportClient exec];
	
	return YES;
}
	
- (void) _applySettingsFromMessageData {
	[_replacements setObject: [_objData getUsername] forKey: @"%USERNAME%"];
	[_replacements setObject: [_objData getPassword] forKey: @"%PASSWORD%"];
	
	WebSMSMessage *_msg = [_objData getMessage];
	[_msg setCharset: [_plugin charset]];
	
	[_replacements setObject: [[_msg getFrom] trimNumber] forKey:@"%FROM%"];
	// "%E_FROM%": URL.encodeWithCharset(URL.encodeWithCharset(this._message.propertyForKey("from"), this._plugin.charset), this._plugin.charset),
	[_replacements setObject: [[_msg getFrom] trimNumber] forKey:@"%E_FROM%"]; // che senso ha?

	//banner_id=&type_flash=&timed_at=&uniqID=%TELE2_IT_UID%&message=%TEXT%%20%FROM%&gsmnumber=%2B%TO_CCODE%%TO%&show_sender_number=&fromname=%FROM%&send_sms=Invia
	[_replacements setObject: [NSString stringWithFormat: @"%d",[_objData getCountryCode]] forKey:@"%CCODE%"];
	[_replacements setObject: [[_msg getTo] trimNumber] forKey:@"%TO%"];
	[_replacements setObject: [_msg getTextEncoded: NO] forKey:@"%TEXT%"];
	
	// "%E_TEXT%": URL.encodeWithCharset(URL.encodeWithCharset(this._message.propertyForKey("text"), this._plugin.charset), this._plugin.charset),
	[_replacements setObject: [_msg getTextEncoded: YES] forKey:@"%E_TEXT%"];

	[_replacements setObject: [_msg getTextEncoded: NO] forKey:@"%U_TEXT%"];
	[_replacements setObject: [_msg getFrom] forKey:@"%U_FROM%"];

	[_replacements setObject: [[_msg getTo] substringWithRange: NSMakeRange(0, 3)] forKey:@"%TO_PREFIX%"];
	[_replacements setObject: [[_msg getTo] substringFromIndex: 3] forKey:@"%TO_NUMBER%"];
	
	[_replacements setObject: [[_msg getTo] substringWithRange: NSMakeRange(0, 3)] forKey:@"%TO_US_AREACODE%"];
	[_replacements setObject: [[_msg getTo] substringWithRange: NSMakeRange(3, 3)] forKey:@"%TO_US_PREFIX%"];
	[_replacements setObject: [[_msg getTo] substringFromIndex: 6] forKey:@"%TO_US_NUMBER%"];
	
	int cCode = [[_msg getTo] getCountryCodeForNumber]; // search country code from dest number
	if (cCode == -1) 
		cCode = [_objData getCountryCode]; // ... not found, assume own country code
	[_replacements setObject: [NSString stringWithFormat:@"%d", cCode] forKey:@"%TO_CCODE%"];

}

#pragma mark RESPONSE FROM TRANSPORT CLIENT

- (void) tclient_connectionFailed:(NSString *) _error {
	[[MCDebug sharedDebug] printDebug: self message: @"Connection failed at step %d while loading %@",_step+1,_error];
	
	[_delegate websms_connectionFailedToServer: _error stageToProcess: _step+1 from: self];
}

- (void) tclient_connectionAbortedByUser {
	[[MCDebug sharedDebug] printDebug: self message: @"Connection aborted by user"];

	[_delegate websms_sendAborted: self];
}

- (void) tclient_serverBadResponseAtURL:(NSString *) _url withMessage:(NSString *) _msg {
	[[MCDebug sharedDebug] printDebug: self message: @"Bad response from server at url %@ with: %@",_url,_msg];

	[_delegate websms_wrongResponseFromServerForURL: _url withMessage: _msg for: self];
	[_delegate websms_sendingFailed: self];
}

- (void) tclient_connectionEstablished {
	[[MCDebug sharedDebug] printDebug: self message: @"Connection established"];

	[_delegate websms_connectionEstablishedFrom: self currentStageIs: _step+1];
}

#define WRITEBACK_PATH	@"~/Library/Application Support/websmslib/%@_%d.html"

- (void) tclient_pluginicon_redirectingToURL:(NSString *) _url {
	[_delegate websms_redirectingToPage: _url];
}

- (void) tclient_serverDataReceived:(NSString *) _sData {
	[[MCDebug sharedDebug] printDebug: self message: @"Server data received. Now processing %d bytes",[_sData length]];

	NSLog(@"\n\n---------------------------------------------------------- STEP %d\n%@\n\n-------------------------------------------------------",_step,_sData);
	
	[_delegate websms_performedStage: _step+1 of: [_plugin steps] from: self];
	
	NSString *_data = [[NSString alloc] initWithString: _sData];
		
	_enablePageWriteBack = YES;
	// debug mode
	if (_enablePageWriteBack) {
		NSString *destPath = [[WRITEBACK_PATH stringByExpandingTildeInPath] stringByDeletingLastPathComponent];
		[[MCDebug sharedDebug] printDebug: self message: @"WRITE BACK DISC: stage %d - path %@ - len %d bytes",
									_step,destPath,[_data length]];
		
		// create folder if not exist
		if ([[NSFileManager defaultManager] fileExistsAtPath: destPath] == NO)
			[[NSFileManager defaultManager] createDirectoryAtPath: destPath  attributes: nil];
		
		// write back
		[[_data sanitizeString: _replacements] writeToFile:[[NSString stringWithFormat: WRITEBACK_PATH,[_plugin name],_step] stringByExpandingTildeInPath] 
				atomically:NO encoding: NSISOLatin1StringEncoding error: nil];
	}
	
	// Clear timeout timer
	[self _clearTimeoutTimer];
	
	
	[[MCDebug sharedDebug] printDebug: self message: @"NOW CHECKING FOR ERRORS AND VARS IN STEP %d",_step];
	
	if (_data != nil) {
		// Search for error markers in the response
		// If one is found, abort the process.
		if (![self _checkErrors: _data]) {
		
			// Extract plugin defined variables
			// from the response
			[self _extractVars: _data];
			
			// Check for service availability by
			// examining the response
			[self _checkSMSAvailability: _data];
			
			// If the current step requires a Captcha to be read,
			// prompt the user and get out of this function.
			// The user will resume the sending by entering the text.
			if ([self _captchaRequired]) {
				[self _performCaptchaRequest];
				[_data release];
				return;
			}
		} else {
			[_delegate websms_sendingFailed: self];
			[_data release];
			return;
		}
	}
	
	if (++_step < [_plugin steps]) {
		[[MCDebug sharedDebug] printDebug: self message: @"INITIALIZING FOR STEP %d....",_step];
		// Proceed to next step
		if (!_shouldAbortSending) {
			// support for delay time
			NSNumber *delayTime = [[[_plugin data] objectForKey: _plugin_delay] retain];
			if (delayTime != nil) {
				[self performSelector:@selector(send) withObject:nil afterDelay: [delayTime intValue]];
				[delayTime release];
			} else {
				[self send];
			}
		} else {
			[_delegate websms_sendAborted: self];
		}
	} else {
		[[MCDebug sharedDebug] printDebug:self message: @"FINAL STEP (%d). CHECK FOR MARKERS",_step];
		// At final step. Checking for success marker
		NSString *successMarker = [[_plugin data] objectForKey: _plugin_successmarker]; 
		AGRegexMatch *matchRes = [self _matchRegExp: successMarker toString: _data];
		if ([matchRes count] > 0)
			[_delegate websms_sendingSucceded: self];
		else
			[_delegate websms_sendingFailed: self];
		[self reset];
	}
	
	[_data release];
}

- (AGRegexMatch *) _matchRegExp:(NSString *) _regexp toString:(NSString *) _source {
	AGRegex *regex = [[AGRegex alloc] initWithPattern: _regexp options: AGRegexCaseInsensitive]; 
	AGRegexMatch *match = [regex findInString: _source];
	
	[[MCDebug sharedDebug] printDebug: self message:  @"CHECK EXP [%@] %d results",_regexp,[match count]];
	
	[regex release];
	return match;
}


/**
 *	@method reset
 *	@abstract Reset the engine, bringing it to the initial state.
 */
- (void) reset {
//	NSLog(@"TODO reset");
}

/**
 *	@method _performCaptchaRequest
 *	@abstract Performs the request for the captcha image.
 */
- (void) _performCaptchaRequest {
	// to do	
	NSString *urls =[[[_plugin stepAtIndex:_step] objectForKey: @"captcha"] batchReplace: _replacements];
	[_captchaSrc release];
	_captchaSrc = [urls retain];
	
	NSData *data = [NSData dataWithContentsOfURL: [NSURL URLWithString: urls]];
	if ([data length] > 0) {
		// tell to delegate to provide captcha code
		[_delegate websms_requestCaptchaCode: _captchaSrc from: self];
	} else {
		// we need to use last captcha
		[_delegate websms_requestPreviousSessionCaptchaCodeForAccount: [_plugin accountName] from:self];
	}
}

/**
 *	@method _captchaRequired
 *	@abstract Checks whether the current step requires a captcha
 *	confirmation image.
 *	@result <tt>true</tt> if the current step requires a captcha.
 */
- (BOOL) _captchaRequired {
	return ([[_plugin stepAtIndex: _step] objectForKey: _plugin_captcha] != nil &&
			_captchaCode == nil);
}

/**
 *	@method _checkSMSAvailability
 *	@abstract Checks whether the current step allows a check for the
 *	number of available messages, and notify the delegate if found.
 *	@param response The server response.
 */
- (void) _checkSMSAvailability:(NSString *) _response {
	NSString *avRegExp = [[_plugin stepAtIndex: _step] objectForKey: _plugin_availabilityCheck];
	if (avRegExp != nil) {
		
		// we need to make some tests here.
		// A great deal could be offer JavaScript runtime execution here but while it's available
		// in WebKit on desktop platform, iPhone SDK seems not have this opportunity (oh damn).
		// So we will perform a simple regexp search (to make plugin compatible with websmslib you
		// should rewrite this key in plugin config.
		AGRegexMatch *match = [self _matchRegExp: avRegExp toString: _response];
		if ([match count] > 0) {
			int av = [[match groupAtIndex: 1] intValue];
			[_delegate websms_availableMessages: av from:self];
		}
	}
}

/**
 *	@method _checkErrors
 *	@abstract Searches for error markers in the response.
 *	@param response The server response.
 */
- (BOOL) _checkErrors:(NSString *) _response {
	NSArray *check = [[_plugin stepAtIndex: _step] objectForKey: _plugin_check];
	
	int k;
	for (k = 0; k < [check count]; k++) {
		NSDictionary *cCheck = [check objectAtIndex: k];
		// evaluate regular expression
		NSString *cExpression = [cCheck objectForKey: _plugin_check_match];
		AGRegex *regex = [[AGRegex alloc] initWithPattern: cExpression options: AGRegexCaseInsensitive]; 
		NSArray *matches = [regex findAllInString:_response];
		
		[[MCDebug sharedDebug] printDebug:self  message: @"[ERR CHECK STEP %d] Checking exp [%@], %d matches in %d bytes response",_step,cExpression,[matches count],[_response length]];
		
		// result is valid? is there any error?
		if ([matches count] > 0) {
			[[MCDebug sharedDebug] printDebug: self message:@"    [ERR MATCH STEP %d] -> %@",_step,[cCheck objectForKey: _plugin_check_reason]];
			[_delegate websms_sendingErrorOccurred: [cCheck objectForKey: _plugin_check_reason] from: self];
			return YES;
		}
	}
	// no matches, no error, we can continue
	return NO;
}

/**
 *	@method _extractVars
 *	@abstract Extracts variable values from the response.
 *	@param response The server response.
 */
- (void) _extractVars:(NSString *) _response {
	NSDictionary *dic = [_plugin stepAtIndex: _step];
	NSArray *vars = [dic objectForKey:_plugin_check_vars];
	if (vars != nil) {
		int k;
		for (k=0; k < [vars count]; k++) {
			NSDictionary *cVar = [vars objectAtIndex: k];
			/*	/i makes the regex match case insensitive.
			 
				Since forward slashes delimit the regular expression, any forward slashes 
				that appear in the regex need to be escaped. E.g. the regex 1/2 is written as /1\/2/ in JavaScript.
			 */
			NSString *cExp = [cVar objectForKey: _plugin_check_match];
			NSString *cKeyName = [NSString stringWithFormat: @"%%%@%%",[cVar objectForKey: _plugin_check_name]];
			
			AGRegex *regex = [[AGRegex alloc] initWithPattern: cExp options: AGRegexCaseInsensitive]; 
			AGRegexMatch *matches = [regex findInString:_response];
			
			[[MCDebug sharedDebug] printDebug: self message:@"[EXTRACT VARS] Regular expression [%@] result %d matches",cExp,[matches count]];

			if ([matches count] > 0) {
				NSNumber *indexToTake = [cVar objectForKey: _plugin_check_index];
				// the default value for index to tage in vars regexp is 1, used when this key is not defined
				if (indexToTake == nil) indexToTake = [NSNumber numberWithInt: 1];
				
				// escape url? yes is default
				NSNumber *escapeVal = [cVar objectForKey: _plugin_check_escape];
				if (escapeVal == nil) escapeVal = [NSNumber numberWithBool: NO];
				
				NSString *usedValue = nil;
				if ([escapeVal boolValue])
					usedValue = [[NSString alloc] initWithString: [[matches groupAtIndex: [indexToTake intValue]] stringByAddingPercentEscapesUsingEncoding: [_plugin usedEncoding]]];
				else
					usedValue = [[NSString alloc] initWithString: [matches groupAtIndex: [indexToTake intValue]]];
				
				[[MCDebug sharedDebug] printDebug: self message:@"  -> SET VAR %%%@%%: %@",cKeyName,usedValue];
				
				[_replacements setObject: [usedValue autorelease] forKey:cKeyName];
				
			} else if ([matches count] == 0) {
				if ([cVar objectForKey: _plugin_check_name] != nil) {
					// required var is missing... we can continue but probability something is changed into the site
					[_delegate websms_missingVariable: cKeyName forStage: _step pageContent: _response for:self];
				}
			}
		}
	}
}

/**
 *	@method _startTimeoutTimer
 *	@abstract Starts the timeout timer.
 */
- (void) _startTimeoutTimer {
	[self _clearTimeoutTimer];
	
	
	_timer = [[NSTimer scheduledTimerWithTimeInterval: WEBSMSENGINE_SENDING_TIMEOUT 
											   target: self  
											 selector: NULL 
											 userInfo: nil 
											  repeats: YES] retain];
	
	#ifdef TARGET_OS_MAC
		[[NSRunLoop currentRunLoop] addTimer: _timer forMode:NSEventTrackingRunLoopMode];
	#endif
	#ifdef IPHONE
		[[NSRunLoop currentRunLoop] addTimer: _timer forMode:NSDefaultRunLoopMode];
	#endif
}

/**
 *	@method _clearTimeoutTimer
 *	@abstract Clears the timeout timer.
 */
- (void) _clearTimeoutTimer {
	[_timer invalidate]; [_timer release];
	_timer = nil;
}

/**
 *	@method _prepareRequest
 *	@abstract Prepares the request for the current sending step.
 */
- (void) _prepareRequest {
	// create transport client
	[_transportClient reset];
	
	// get current plugin step data
	NSDictionary *current_step = [_plugin stepAtIndex: _step];
	
	// plugin authentication (username & password)
	if ([[_plugin data] objectForKey: _plugin_authentication] != nil) {
		[_transportClient setAuthentication: [[_plugin data] objectForKey: _plugin_authentication]];
		[_transportClient setUsername: [[[_plugin data] objectForKey: _plugin_username] batchReplace: _replacements]
						  andPassword: [[[_plugin data] objectForKey: _plugin_password] batchReplace: _replacements]];
	}
	
	// setup plugin charset
	if ([[_plugin data] objectForKey: _plugin_charset] != nil)
		[_transportClient setCharset: [[_plugin data] objectForKey: _plugin_charset]];

	// setup plugin action url
	NSString *cAction = [[current_step objectForKey: _plugin_action] batchReplace: _replacements];
	[_transportClient setURL: cAction];
	
	
	// setup plugin data
	if ([[current_step objectForKey: _plugin_data] length] > 0) {
			NSString *dData =  [[current_step objectForKey: _plugin_data] batchReplace: _replacements];
		[_transportClient setPostData:dData];
	}
	
	// referrer url for connection
	if ([current_step objectForKey: _plugin_referrer] != nil)
		[_transportClient setReferrer: [[current_step objectForKey: _plugin_referrer] batchReplace: _replacements]];
	
	// apply cookies to connection
	if ([current_step objectForKey: _plugin_cookies] != nil)
		[_transportClient setCookies: [current_step objectForKey: _plugin_cookies]];	
}

- (WebSMSPlugin *) getPlugin {
	return _plugin;
}

- (WebSMSData *) getMessageData {
	return _objData;
}

- (void) setEnablePageWriteBack:(BOOL) _en {
	_enablePageWriteBack = _en;
}

@end
