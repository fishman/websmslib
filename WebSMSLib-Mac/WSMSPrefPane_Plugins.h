//
//  WSMSPrefPane_Plugins.h
//  websmslib
//
//  Created by malcom on 9/6/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "WebSMSApp.h"

@interface WSMSPrefPane_Plugins : NSObject <WebSMSPlugin_UpdateCheckingDelegate> {
	IBOutlet	NSTableView			*tbl_installedPlugins;
	IBOutlet	NSProgressIndicator *down_prg_statusBar;
	IBOutlet	NSTextField			*down_fld_statusField;
	IBOutlet	NSTextField			*down_fld_summaryField;

	IBOutlet	NSWindow			*wnd_downloadWindow;
	
	NSArray			*_pluginList;
	int				 _currentUpdatingIndex;
	int				 _updatedPlugins;
	int				 _failedPlugins;
}

- (void) reloadPluginsList;
- (void) _startAnotherPluginCheck;

- (IBAction) btn_checkUpdates:(id) sender;

@end
