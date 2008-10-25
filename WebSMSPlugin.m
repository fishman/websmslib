//
//  WebSMSPlugin.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WebSMSPlugin.h"
#import "MCDebug.h"
#import "NSString_Extensions.h"
#import "NSData_Extensions.h"
#import "AGRegex.h"
#import "WebSMSApp.h"


// internal keys
#define _plugin_transport		@"transport"
#define _plugin_steps			@"steps"

@implementation WebSMSPlugin


- (id) initWithConfigurationFile:(NSString *) _path {
	self = [super init];
	if (self != nil) {
		if ([[NSFileManager defaultManager] fileExistsAtPath: _path])
			_pathToFile = [_path retain];
		else return nil;
		
		_receivedFavIconData = nil;
		_receivedData = nil;
		_downloadFavIconInProgress = NO;
	}
	return self;
}

- (void) setAccountName:(NSString *) _name {
	[_accountName release];
	_accountName = [_name retain];
}

- (NSString *) accountName {
	return _accountName;
}

- (NSString *) pathToFile {
	return _pathToFile;
}

- (void) dealloc
{
	[_pathToFile release];
	[_data release];
	[_updateConnection release];
	[_receivedFavIconData release];
	[_favIconDelegate release];
	[_favIconConnection release];
	[_delegate release];
	[_receivedData release];
	[super dealloc];
}

- (NSString *) version {
	return [[self data] objectForKey: _plugin_version];
}

- (NSDictionary *) data {
	if (_data == nil) // data will be loaded lazily when needs
		if ([[NSFileManager defaultManager] fileExistsAtPath: _pathToFile])
			_data = [[NSMutableDictionary alloc] initWithContentsOfFile: _pathToFile];
	return _data;
}

- (void) _downloadFavIconViaHTML:(NSString*) _firstPageURL {
	if (_downloadFavIconInProgress) {
		[[MCDebug sharedDebug] printDebug:self message:@"Favicon request just sent...wait for previous result"];
	} else {
		[[MCDebug sharedDebug] printDebug: self message: @"Start download service icon... %@ (%@)",[self name],_firstPageURL];
		[_favIconConnection release];
		_downloadFavIconInProgress = YES;
		
		_receivedFavIconData = [[NSMutableData alloc] init];
	
		NSURLRequest *_req = [[NSURLRequest alloc] initWithURL: [NSURL URLWithString: _firstPageURL]];
		_favIconConnection = [[NSURLConnection alloc] initWithRequest: [_req autorelease] delegate:self];
	}
}

- (NSData *) serviceIcon {
	// get icon if it's not available (and pref say to us we can)
	//[self setServiceIcon: nil];
	if ([_data objectForKey: _plugin_ico] == nil && [self steps] > 0) {
		[self _downloadFavIconViaHTML: [[_data objectForKey: _plugin_mainsite] completeDomain]];
	} else 	[[MCDebug sharedDebug] printDebug:self message: @"Cached icon for %@: %d (%@)",[self name],[[_data objectForKey: _plugin_ico]length],_pathToFile];
	return [_data objectForKey: _plugin_ico];
}

- (void) setServiceIcon:(NSData *) _icon {
	if (_icon == nil || [_icon length] == 0 && [_data objectForKey: _plugin_ico] != nil) {
		[_data removeObjectForKey: _plugin_ico];
	} else {
		[_data setObject: _icon forKey: _plugin_ico];
	}
	[self writeToFile];
}

- (NSString *) name {
	return [[self data] objectForKey: _plugin_name];
}

- (int) steps {
	return [[[self data] objectForKey: _plugin_steps] count];
}

- (int) charset {
	return NSISOLatin1StringEncoding;
}

- (NSDictionary *) stepAtIndex:(int) _idx {
	return [[_data objectForKey: _plugin_steps] objectAtIndex: _idx];
}

- (BOOL) isOlderThan:(WebSMSPlugin *) _compare {
	NSArray *thisVersion = [[self version] componentsSeparatedByString:@"."];
	NSArray *compareVersion = [[_compare version] componentsSeparatedByString: @"."];
	
	int k = 0;
	for (k = 0; k < [compareVersion count]; k++) {
		NSString *cPointValue = [compareVersion objectAtIndex: k];
		int compareValue = [cPointValue intValue];
		int thisValue = [[thisVersion objectAtIndex: k] intValue];
		if (compareValue > thisValue) return YES;
		k++;
	}
	return NO;
}

- (void) setUpdateCheckDelegate:(NSObject <WebSMSPlugin_UpdateCheckingDelegate> *) delegate {
	[_delegate release];
	_delegate = [delegate retain];
}

- (BOOL) isUpdating {
	return _updateConnection != nil;
}

- (BOOL) update {
	if (_updateConnection != nil) return NO; // another check is in progress
	
	[_delegate websms_updateplugin_startConnectingFor: self];
	
	[_receivedData release];
	_receivedData = [[NSMutableData alloc] init];
	_connectedAlertSent = NO;
	
	NSMutableURLRequest *req = [[NSMutableURLRequest alloc] initWithURL: [NSURL URLWithString: [[self data] objectForKey: _plugin_update_url]]];
	[req setCachePolicy:NSURLRequestReloadIgnoringCacheData];
	
	_updateConnection = [[NSURLConnection alloc] initWithRequest: req delegate: self];
	/*_updateConnection = [[NSURLConnection alloc] initWithRequest: req 
														delegate: self 
												startImmediately: YES];
	*/
	[req autorelease];
	
	return YES;
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
	if (connection == _favIconConnection) {
		[self websms_pluginicon_cannotDownload];
	} else {
		[_delegate websms_updateplugin_cannotConnect: [[self data] objectForKey: _plugin_update_url] forPlugin: self];
	}
}

#pragma mark FAV ICON MANAGER

- (void) setFavIconDelegate:(NSObject <WebSMSPlugin_FavIconCheck> *) delegate {
	[_favIconDelegate release];
	_favIconDelegate = [delegate retain];
}

- (void) websms_pluginicon_cannotDownload {
	[_favIconConnection release];
	_favIconConnection = nil;
	
	[_favIconDelegate websms_pluginicon_cannotDownload];
}

- (void) websms_pluginicon_done:(NSData *) _icon {
	[_favIconDelegate websms_pluginicon_done: _icon];
	[self setServiceIcon: _icon];
	
	[_favIconConnection release];
	_favIconConnection = nil;
}


#define TEMP_UPDATE_DIRECTORY @"~/Library/Application Support/websmslib/"

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
	if (connection == _favIconConnection) {
		_downloadFavIconInProgress = NO;
		
		[[MCDebug sharedDebug] printDebug: self message: @"... Data receivied for favicon at  %@",[self name]];
		
		NSString *favScript =  [[NSString alloc] initWithData: _receivedFavIconData encoding: NSISOLatin1StringEncoding];
		
		[_receivedFavIconData release]; _receivedFavIconData = nil;
		
		NSString *matchValue = @"<link rel=\"icon\" href=\"(\\S+)\"";
		AGRegex *regex = [AGRegex regexWithPattern: matchValue options: AGRegexCaseInsensitive]; 
		AGRegexMatch *res = [regex findInString: favScript];
		NSString *urlToFav = nil;
		NSData *dataIcon =nil;
		
		if ([res count] > 0) {
			urlToFav = [NSString stringWithFormat: @"%@%@",
									  [[_data objectForKey: _plugin_mainsite] completeDomain],
								  [res groupAtIndex:1]];

			
		}
		
		if (urlToFav == nil || res == nil) {
			// if favicon code was not found inside the first html page we can download
			// it from standard location at favicon.ico in /root directory of the site
			urlToFav = [NSString stringWithFormat: @"%@/favicon.ico",[[_data objectForKey: _plugin_mainsite] completeDomain]];
			[[MCDebug sharedDebug] printDebug: self message: @"Favicon not found in html page of %@. Downloading from standard loc %@",[self name],urlToFav];			
		}
		
		dataIcon = [[[NSData alloc] initWithContentsOfURL: [NSURL URLWithString:urlToFav]] favIconResize];
		if (dataIcon != nil) {
			[self performSelectorOnMainThread: @selector(websms_pluginicon_done:) 
						withObject: dataIcon
								waitUntilDone: YES];
			[[MCDebug sharedDebug] printDebug: self message: @"Downloaded %d for favicon for %@ at: %@",[dataIcon length],[self name],urlToFav];
		} else {
			[[MCDebug sharedDebug] printDebug: self message: @"Favicon not found for %@",[self name]];
			[self performSelectorOnMainThread: @selector(websms_pluginicon_cannotDownload)
									withObject: nil
								waitUntilDone:YES];
		}
		
		[favScript release];
		[_favIconConnection cancel];
		[_favIconConnection release];
		return;
	}
	
	
	NSString *script =  [[NSString alloc] initWithData: _receivedData encoding: NSISOLatin1StringEncoding];

	
	// write the temp file
	if ([[NSFileManager defaultManager] fileExistsAtPath: [TEMP_UPDATE_DIRECTORY stringByExpandingTildeInPath]] == NO)
		[[NSFileManager defaultManager] createDirectoryAtPath: [TEMP_UPDATE_DIRECTORY stringByExpandingTildeInPath] attributes: nil];
	
	NSString *ffile = [NSString stringWithFormat: @"%@/%@.plist",[TEMP_UPDATE_DIRECTORY stringByExpandingTildeInPath],[self name]];
	[script writeToFile: ffile atomically: NO encoding: NSISOLatin1StringEncoding error: nil];
	[script release];
	// load plugin
	WebSMSPlugin *toCheck = [[WebSMSPlugin alloc] initWithConfigurationFile: ffile];
	// remove the temp file
	[[NSFileManager defaultManager] removeFileAtPath: ffile handler: nil];
	
	if ([self isOlderThan: toCheck]) {
		// replace the old one
		NSError *err = nil;
		[[NSFileManager defaultManager] removeFileAtPath:[self pathToFile] handler:nil];

		if (err != nil) [_delegate websms_updateplugin_cannotSaveNewPlugin: self];
		
		BOOL ok = [[toCheck data] writeToFile: [self pathToFile] atomically:NO];
		if (ok) {
			// reset
			[_data release]; _data = nil;
			// notify
			[_delegate websms_updateplugin_pluginUpdatedTo: [self version] for: self];
		} else [_delegate websms_updateplugin_cannotSaveNewPlugin: self];
	} else {
		[_delegate websms_updateplugin_noUpdatesAvailable: self];
	}
	
	[_updateConnection release];
	_updateConnection = nil;
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
	if (connection == _favIconConnection) {
		[[MCDebug sharedDebug] printDebug: self message: @"... Receiving favicon data from %@",[self name]];
		[_receivedFavIconData appendData: data];
	} else {
		if (!_connectedAlertSent) {
			_connectedAlertSent = YES;
			[_delegate websms_updateplugin_receivingDataFor: self];
		}
		[_receivedData appendData:data];
	}
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
	   [newRequest setHTTPMethod: @"POST"];
	   [newRequest setHTTPShouldHandleCookies: YES];
	
	   [_receivedData release];
	   _receivedData = [[NSMutableData alloc] init];
	
	   [[MCDebug sharedDebug] printDebug: self message: @"--> Redirecting to %@",[[newRequest URL] absoluteString]];
		return newRequest;
   } else {
	   // Just being shown the final request prior to transmission
	   // 10.5+
	   return request;
   }
}

- (NSString *) getAuthor {
	return [[_data objectForKey: _plugin_report_fields] objectForKey: _plugin_report_name];
}

- (int) maxCharsAllowed {
	return [[_data objectForKey: _plugin_maxChars] intValue];
}

- (NSDate *) getLastUpdateDate {
	return [_data objectForKey: _plugin_lastUpdate];
}

- (void) setLastUpdate:(NSDate *) _date {
	[_data setObject: _date forKey:_plugin_lastUpdate];
}

- (NSDictionary *) reportContacts {
	return [_data objectForKey:_plugin_report_fields];
}

- (BOOL) saveDataInUserPreferences:(NSString *) _username pass:(NSString *) _pass {
	if ([self accountName] == nil) {
		[[MCDebug sharedDebug] printDebug: self message: @"This \'%@\' plugin istance is not linked with any account. Set a valid account using -setAccountName",[self name]];
		return NO;
	} else {
		return [WebSMSPlugin _saveDataInUserPreferences: _username pass: _pass accountName: [self accountName] plugInName: [self name]];
	}
}

+ (BOOL) _saveDataInUserPreferences:(NSString *) _username pass:(NSString *) _pass accountName:(NSString *) _acname plugInName:(NSString *) _pname {
	if (_acname != nil) {
		NSMutableDictionary *_accountsGroupsList = [[[WebSMSAppManager sharedManager] accountsListPreferences] retain];
		// replace our existing account (or we will create a new one)
		[_accountsGroupsList setObject: [NSDictionary dictionaryWithObjectsAndKeys:	_username,_plugin_auth_user,
																				_pass,_plugin_auth_pass,
																				_acname,_plugin_auth_accountname,
																				_pname,_plugin_auth_plugin,
																				nil,nil]
						 forKey: _acname];
		
		[[WebSMSAppManager sharedManager] saveAccountsListPreferences: _accountsGroupsList];
		return YES;
	} return NO;
}
		

- (NSDictionary *) getAuthdataFromPreferences {
/*	NSData *_rdata =  [[NSUserDefaults standardUserDefaults] objectForKey: ACCOUNTS_GROUP];
	if (_rdata == nil) return nil;
	
	NSMutableDictionary *_accountsGroupsList = [[NSUnarchiver unarchiveObjectWithData: _rdata] retain];
	NSDictionary *_info = [[NSDictionary alloc] initWithDictionary: [[_accountsGroupsList objectForKey: [self name]] objectForKey: _accountName]];
	[_accountName release];
	if ([_info count] == 0) { [_info release]; return nil; }
	else return [_info autorelease];	*/
	return [[WebSMSAppManager sharedManager] getAccountNamed: _accountName];
}

- (void) writeToFile {
	[_data writeToFile: _pathToFile atomically: NO];
}

- (NSStringEncoding ) usedEncoding {
	NSString *encMIMEName = [_data objectForKey: _plugin_charset];
	NSStringEncoding encType = [encMIMEName returnContentEncodingFromMIME];
	return encType;
}

@end
