//
//  ActivityMonitorController.h
//  websmslib
//
//  Created by malcom on 9/6/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>


@interface ActivityMonitorController : NSObject {
	IBOutlet	NSTableView		*tbl_logView;
				NSMutableArray	*tbl_logsItems;
	IBOutlet	NSWindow		*ass_wnd_ActivityWindow;
	IBOutlet	NSWindow		*ass_wnd_sendWindow;

	IBOutlet	NSButton		*btn_enableDebug;
	IBOutlet	NSTextField		*_report_fld_contact;
	IBOutlet	NSTextField		*_report_fld_authorname;
	IBOutlet	NSTextField		*_report_fld_note;
	IBOutlet	NSPopUpButton	*_report_plugin;
	
				BOOL			int_isWindowOpened;

}

+ (ActivityMonitorController *) sharedUIActivityMonitor;
- (void) toggleWindow;
- (void) openWindow;
- (void) closeWindow;
- (void) addNewLog:(NSString *) _log;

- (IBAction) btn_enableDebug:(id) sender;
- (IBAction) btn_clear:(id) sender;
- (IBAction) btn_sendDebugMessages:(id) sender;
- (IBAction) btn_export:(id) sender;

- (IBAction) _report_btn_send:(id) sender;
- (IBAction) _report_btn_cancel:(id) sender;
- (IBAction) _report_btn_changePlugin:(id) sender;

- (BOOL)sendEmailTo:(NSString *)to subject:(NSString *)subject body:(NSString *)messageBody attachment:(NSString *)filePath;
@end
