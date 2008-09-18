//
//  TransportClient.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "TransportClient.h"
#import "WebSMSEngine.h"
#import "NSString_Extensions.h"
#import "MCDebug.h"

#define STEALTH_USERAGENT	@"Mozilla/5.0 (Mac OS X; 10.5.4) WebSMSLibCocoa/2.9.10"

@implementation TransportClient


- (id) init
{
	self = [super init];
	if (self != nil) {
		_request = nil;
		_delegate = nil;	
		_connectedAlertSent = NO;
		// cookie accept policy
		[[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookieAcceptPolicy: NSHTTPCookieAcceptPolicyAlways];
	}
	return self;
}

- (void) dealloc
{
	[_request release];
	[_connection release];
	[_options release];
	[_receivedData release];
	[_delegate release];
	
	[super dealloc];
}

#pragma mark ACTIONS

- (void) reset {
	[_options release]; _options = [[NSMutableDictionary alloc] init];
}

- (void) abort {
	[_connection cancel];
	[[MCDebug sharedDebug] printDebug: self message: @"Connection aborted by user"];
	
	[_delegate tclient_connectionAbortedByUser];
}

- (void) exec {
	// create url to load
	NSString *ind = ([[_options objectForKey: @"CURLOPT_POSTFIELDS"] length] < 1 ? 
								[_options objectForKey: @"CURLOPT_URL"] : 
									[NSString stringWithFormat: @"%@?%@",[_options objectForKey: @"CURLOPT_URL"],
									 [_options objectForKey: @"CURLOPT_POSTFIELDS"]]);
	
	// create request
	[_request release];
	NSString *ref = [_options objectForKey: @"CURLOPT_REFERER"];
	NSURL  *_url = [NSURL URLWithString: ind relativeToURL: [NSURL URLWithString: (ref != nil ? ref : ind)]];
	
	// bad url! something missed in your plugin
	if (_url == nil) {
		[_delegate tclient_serverBadResponseAtURL: ind withMessage: @"Bad URL string. Cannot be create an url with this."];
		return;
	}
	
	_request = [[NSMutableURLRequest alloc] initWithURL: _url];
	[_request setHTTPMethod: @"POST"];
	[_request setHTTPShouldHandleCookies: YES];
	
	// setup user agent (standard mode or custom)
	[_request setValue: ([_options objectForKey: @"CURLOPT_USERAGENT"] == nil ? 
						 STEALTH_USERAGENT :
						 [_options objectForKey: @"CURLOPT_USERAGENT"]) 
		forHTTPHeaderField:@"User-Agent"];	

	// init session data container
	[_receivedData release];
	_receivedData= [[NSMutableData alloc] init];//[[NSMutableData data] retain];
	
	// setup cookies if available
	[self _applyCookiesToRequestAtAddress:ind];

	// create a new connection
	[_connection release];
	_connectedAlertSent = NO;
	
	_connection = [[[NSURLConnection alloc] initWithRequest: _request delegate: self] retain];
/*	_connection = [[[NSURLConnection alloc] initWithRequest: _request 
													delegate: self 
										  startImmediately: YES] retain];
*/
	// print debug
	NSString *dLog = [[NSString alloc] initWithFormat: @"Loading %@ (%d cookies available)",
															[[_request URL] absoluteString],
															[[[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL: [_request URL]] count]];
	[[MCDebug sharedDebug] printDebug: self message: [dLog autorelease]];
}

#pragma mark CONNECTION DATA DELEGATE

- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
	NSLog(@"merdoso");
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
	[_delegate tclient_connectionFailed: [error localizedDescription]];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
	[[MCDebug sharedDebug] printDebug: self message: @"... OK Completed page data received: %d bytes",[_receivedData length]];
	
	if ([_receivedData length] > 0) {
		NSString *script =  [[NSString alloc] initWithData: _receivedData encoding: NSISOLatin1StringEncoding];
		[_delegate tclient_serverDataReceived: script];

		[script release];
	} else {
		[_delegate tclient_serverBadResponseAtURL: [[_request URL] absoluteString] 
										withMessage: [NSString stringWithFormat: @"Length of result data is 0 (%d)",[_receivedData length]]];
	}
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
	if (!_connectedAlertSent) {
		_connectedAlertSent = YES;
		[_delegate tclient_connectionEstablished];
	}
	
	[_receivedData appendData:data];
	[[MCDebug sharedDebug] printDebug: self message: @"... Receiving data from server: %d bytes (total: %d)",[data length],[_receivedData length]];
}

-(NSURLRequest *)connection:(NSURLConnection *)connection willSendRequest:(NSURLRequest *)request redirectResponse:(NSURLResponse *)redirectResponse {
   if (redirectResponse != nil) {
	   // this seems important for 10.4 (10.5+ works well without it)
	   // Handle the redirection; older code goes here
	   NSMutableURLRequest *newRequest = [request mutableCopy];
	   // returned request has had the UA field stripped, must fix
	   [newRequest setTimeoutInterval:15.0];
	   [newRequest setCachePolicy:NSURLRequestReloadIgnoringCacheData];
		// setup user agent (standard mode or custom)
	   [newRequest setValue: ([_options objectForKey: @"CURLOPT_USERAGENT"] == nil ? 
						 STEALTH_USERAGENT :
						 [_options objectForKey: @"CURLOPT_USERAGENT"]) 
					forHTTPHeaderField:@"User-Agent"];	
	   [newRequest setHTTPMethod: @"POST"];
	   [newRequest setHTTPShouldHandleCookies: YES];
	
	
		// setup cookies if available
	   [self _applyCookiesToRequestAtAddress: [[newRequest URL] absoluteString]];
	
	   [_receivedData release];
	   _receivedData = [[NSMutableData alloc] init];
	
	   [[MCDebug sharedDebug] printDebug: self message: @"--> Redirecting to %@",[[newRequest URL] absoluteString]];
	   
	   [_delegate tclient_pluginicon_redirectingToURL: [[newRequest URL] absoluteString]];

	   return newRequest;
   } else {
	   // Just being shown the final request prior to transmission
	   // 10.5+
	   	   [_delegate tclient_pluginicon_redirectingToURL: [[request URL] absoluteString]];

	   return request;
   }
}

- (NSCachedURLResponse *)connection:(NSURLConnection *)connection willCacheResponse:(NSCachedURLResponse *)cachedResponse {
	// we don't want to maintain a cache
	return nil;
}
	
#pragma mark SETUP DATA
	
- (void) setDelegate:(NSObject <TransportClient_Delegate>*) delegate {
	[_delegate release];
	_delegate = [delegate retain];
}
	
- (void) setAuthentication:(NSString *) authentication {
	[_options setObject: @"CURLOPT_HTTPAUTH" forKey: authentication];
}

- (void) setUsername:(NSString *) username andPassword:(NSString *) password {
	[_options setObject: [NSString stringWithFormat: @"%@:%@",username,password] forKey: @"CURLOPT_USERPWD"];
}

- (void) setCharset:(NSString *) charset {
	[_options setObject: charset forKey: @"CURLOPT_CHARSET"];
}

- (void) setURL:(NSString *) url {
	[_options setObject: url forKey:@"CURLOPT_URL"];
}

- (void) setPostData:(NSString *) data {
	[_options setObject: [NSNumber numberWithBool: YES] forKey: @"CURLOPT_POST"];
	[_options setObject: data forKey: @"CURLOPT_POSTFIELDS"];
}

- (void) setReferrer:(NSString *) referrer {
	[_options setObject: referrer forKey: @"CURLOPT_REFERER"];
}

- (void) setUserAgent:(NSString *) userAgent {
	[_options setObject: userAgent forKey:@"CURLOPT_USERAGENT"];
}

- (void) setCookies:(NSArray *) _cookiesList {
	[_options setObject: _cookiesList forKey:@"CURLOPT_COOKIE"];
}

#pragma mark PRIVATE METHODS

/**
 *	@method _applyCookiesToRequestAtAddress
 *	@abstract apply cookies to given address
 */
- (void) _applyCookiesToRequestAtAddress:(NSString *) addr {
	if ([_options objectForKey: @"CURLOPT_COOKIE"] != nil) {
		int k;
		NSArray *cookiesList = [_options objectForKey: @"CURLOPT_COOKIE"];
		for (k=0; k < [cookiesList count]; k++) {
			NSDictionary *cCooke = [cookiesList objectAtIndex: k];
			NSString *domainString = [addr domainStringFromURL];
			NSDictionary *prop = [NSDictionary dictionaryWithObjectsAndKeys:
								  
										 [cCooke objectForKey: _plugin_cookie_name],NSHTTPCookieName,
										 [cCooke objectForKey: _plugin_cookie_value],NSHTTPCookieValue,
										  domainString,NSHTTPCookieDomain,
										@"FALSE",NSHTTPCookieDiscard,
										@"/",NSHTTPCookiePath,
								nil];
			NSHTTPCookie *cookies = [[NSHTTPCookie alloc] initWithProperties: prop];
			[[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie: cookies];
			
			// print debug
			[[MCDebug sharedDebug] printDebug: self message:@"   -> Cookie: %@,  Value: %@  (%d)",[cCooke objectForKey: _plugin_cookie_name],[cCooke objectForKey: _plugin_cookie_value],cookies != nil];
		}
	}
}

@end
