//
//  AccountsSubViewController.m
//  websmslib
//
//  Created by malcom on 9/4/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "AccountsSubViewController.h"
#import "WebSMSApp.h"

@implementation AccountsSubViewController

- (id) initWithAccountData:(NSDictionary *) _data {
	self = [super initWithBundleNamed:@"AccountsSubView"];
	if (self != nil) {
		_accountData = [_data retain];

		NSLog(@"Loading account %@ at provider %@",[_accountData objectForKey: _plugin_auth_accountname],
			  [_accountData objectForKey:_plugin_auth_plugin]);
		
		
		[fld_AccountName setStringValue: [_accountData objectForKey: _plugin_auth_accountname]];
		NSString *desc = [NSString stringWithFormat: @"%@ as %@",[_accountData objectForKey: _plugin_auth_plugin],[_accountData objectForKey: _plugin_auth_user]];
		[fld_AccountInfo setStringValue: desc];
		
		_plugin = [[WebSMSPluginManager sharedManager] getPluginWithName: 
													[_accountData objectForKey:_plugin_auth_plugin]];
		
		[_plugin setFavIconDelegate: self];
		
		NSImage *servIcon = [[NSImage alloc] initWithData: [_plugin serviceIcon]];
		if (servIcon != nil) {
			[image_ProviderIcon setImage: servIcon];
		} else [image_ProviderIcon setImage: [NSImage imageNamed: @"standard_plugin"]];
	}

 return self;
}

- (NSDictionary *) accountsData {
	return _accountData;
}


- (void) dealloc
{
	[_accountData release];
	[super dealloc];
}


#pragma mark PLUGIN SERVICE ICON DOWNLOAD (ASYNC)

- (void) websms_pluginicon_cannotDownload {
	[[MCDebug sharedDebug] printDebug: self message: @"Cannot found service icon plugin for %@",[_plugin name]];
}

- (void) websms_pluginicon_done:(NSData *) _icon {
	NSImage *servIcon = [[NSImage alloc] initWithData: _icon];
	if (servIcon != nil) [image_ProviderIcon setImage: servIcon];
}


@end
