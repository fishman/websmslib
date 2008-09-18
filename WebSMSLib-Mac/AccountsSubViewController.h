//
//  AccountsSubViewController.h
//  websmslib
//
//  Created by malcom on 9/4/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "SubviewController.h"
#import "WebSMSApp.h"

@interface AccountsSubViewController : SubviewController <WebSMSPlugin_FavIconCheck> {
	IBOutlet	NSTextField *fld_AccountName;
	IBOutlet	NSTextField *fld_AccountInfo;
	IBOutlet	NSImageView	*image_ProviderIcon;
	
	NSDictionary *_accountData;
	WebSMSPlugin *_plugin;
}

- (id) initWithAccountData:(NSDictionary *) _data;
- (NSDictionary *) accountsData;

@end
