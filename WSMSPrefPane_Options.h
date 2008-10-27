//
//  WSMSPrefPane_Options.h
//  websmslib
//
//  Created by malcom on 9/6/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>


@interface WSMSPrefPane_Options : NSObject {
	IBOutlet	NSPopUpButton	*pop_signature;
	IBOutlet	NSTextField		*fld_customSignature;
	IBOutlet	NSPopUpButton	*pop_countries;
	IBOutlet	NSButton		*btn_rememberAccounts;
	IBOutlet	NSButton		*btn_enableSpellCheck;
	IBOutlet	NSButton		*btn_enableDeepDebug;

}

- (void) reloadSettings;
- (IBAction) btn_changePreference:(id) sender;

@end
