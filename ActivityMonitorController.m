//
//  ActivityMonitorController.m
//  websmslib
//
//  Created by malcom on 9/6/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "ActivityMonitorController.h"
#import <Message/NSMailDelivery.h>
#import <AddressBook/AddressBook.h>
#import "WebSMSApp.h"
#import "MCDebug.h"

id _ui_sharedActivityMonitor;

@implementation ActivityMonitorController

+ (ActivityMonitorController *) sharedUIActivityMonitor {
	if (! _ui_sharedActivityMonitor )
        [[self alloc] init];
    return _ui_sharedActivityMonitor;
}

- (void)windowWillClose:(NSNotification *)notification {
	int_isWindowOpened = NO;
}

- (id) init {
    if ( _ui_sharedActivityMonitor ) {
        [self dealloc];
        return nil;
    } else {
		self = [super init];
	
		BOOL ok = NO;
		if (!ass_wnd_ActivityWindow) ok = [NSBundle loadNibNamed: @"ActivityMonitor" owner: self];
		_ui_sharedActivityMonitor = self;
		int_isWindowOpened = NO;
		
		return _ui_sharedActivityMonitor;
    }
}

- (void) toggleWindow {	
	if (int_isWindowOpened) {
		[ass_wnd_ActivityWindow orderOut:nil];
	} else {
		[tbl_logView reloadData];
		[ass_wnd_ActivityWindow orderFront: nil];
		
	}
	int_isWindowOpened = !int_isWindowOpened;
}

- (void) awakeFromNib {
	[tbl_logView setDelegate: self];
	[tbl_logView setDataSource: self];
	[tbl_logView setTarget: self];
	tbl_logsItems = [[NSMutableArray alloc] init];
}
- (void) dealloc
{
	[tbl_logsItems release];
	[super dealloc];
}

- (void) closeWindow {
	[ass_wnd_ActivityWindow orderOut:nil];
	int_isWindowOpened = NO;
}

- (void) openWindow {
	[ass_wnd_ActivityWindow orderFront:nil];
	[tbl_logView reloadData];
	[btn_enableDebug setState: ([[[NSUserDefaults standardUserDefaults] objectForKey: @"debug_mode"] boolValue] ? NSOnState : NSOffState)];
	
	int_isWindowOpened = YES;
}

- (IBAction) btn_enableDebug:(id) sender {
	[[NSUserDefaults standardUserDefaults] setObject: [NSNumber numberWithBool: ([btn_enableDebug state] == NSOnState ? YES : NO)]
											   forKey:@"debug_mode"];
	[[MCDebug sharedDebug] setDebugON: [[[NSUserDefaults standardUserDefaults] objectForKey: @"debug_mode"] boolValue]];

}

- (IBAction) btn_clear:(id) sender {
	[tbl_logsItems removeAllObjects];
	[tbl_logView reloadData];
}

- (IBAction) btn_sendDebugMessages:(id) sender {
	[_report_plugin removeAllItems];
	[_report_plugin addItemsWithTitles: [[WebSMSPluginManager sharedManager] pluginServices]];
	
	ABPerson *me = [[ABAddressBook sharedAddressBook] me];		
	if (me != nil && [me valueForProperty: kABEmailProperty] != nil)
		[_report_fld_contact setStringValue: [[me valueForProperty: kABEmailProperty] valueAtIndex: 0]];
	else [_report_fld_contact setStringValue: NSLocalizedStringFromTable(@"UI_InsertEmailReport",@"Dialogs",@"")];
	
	[self _report_btn_changePlugin: nil];
	
	[NSApp beginSheet: ass_wnd_sendWindow 
			modalForWindow: ass_wnd_ActivityWindow
			modalDelegate:self 
			didEndSelector:NULL 
			contextInfo:nil];	
}

- (void) _closeReportSheet {
	[NSApp endSheet: ass_wnd_sendWindow];
	[ass_wnd_sendWindow orderOut:nil];
}


- (int)numberOfRowsInTableView:(NSTableView *)aTableView {
	int tot = [tbl_logsItems count];
	return tot;
}


- (id)tableView:(NSTableView *)aTableView objectValueForTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	return [tbl_logsItems objectAtIndex: rowIndex];
}

- (void)tableView:(NSTableView *)aTableView willDisplayCell:(id)aCell forTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {	
}

- (BOOL)tableView:(NSTableView *)aTableView shouldEditTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	return NO;
}

- (void) addNewLog:(NSString *) _log {
	[tbl_logsItems addObject: _log];
	if (int_isWindowOpened) {
		[tbl_logView reloadData];
		[tbl_logView scrollRowToVisible: [tbl_logsItems count]-1];
	}
}

	#define TEMP_UPDATE_DIRECTORY @"~/Library/Application Support/websmslib/"
	#define REPORT_NAME	@"Report_%@_%@.txt"
- (IBAction) _report_btn_send:(id) sender {
	if ([[NSFileManager defaultManager] fileExistsAtPath: [TEMP_UPDATE_DIRECTORY stringByExpandingTildeInPath]] == NO)
		[[NSFileManager defaultManager] createDirectoryAtPath: [TEMP_UPDATE_DIRECTORY stringByExpandingTildeInPath] attributes: nil];

	NSCalendarDate *date = [NSCalendarDate date];
	
	NSString *_fPath = [[NSString stringWithFormat: REPORT_NAME,
						 [[_report_plugin titleOfSelectedItem] stringByTrimmingCharactersInSet:
							[NSCharacterSet characterSetWithCharactersInString:@": \t"]],
						 [date descriptionWithCalendarFormat:@"%m_%d_%y_%H%M%S"]] stringByExpandingTildeInPath];
	
	if ([[tbl_logsItems componentsJoinedByString:@""] writeToFile: _fPath atomically:NO]) {
		WebSMSPlugin *plg = [[WebSMSPluginManager sharedManager] getPluginWithName: [_report_plugin titleOfSelectedItem]];
		
		BOOL ok = [self sendEmailTo: [[plg reportContacts] objectForKey: _plugin_report_email] 
						subject:[NSString stringWithFormat: NSLocalizedStringFromTable(@"UI_Report_EmailSubject",@"Dialogs",@""),[plg name]]
					body: [NSString stringWithFormat: NSLocalizedStringFromTable(@"UI_Report_EmailBody",@"Dialogs",@""),[_report_fld_note stringValue]]
			   attachment: _fPath];
		
		[[NSFileManager defaultManager] removeFileAtPath: _fPath handler: nil];
		if (ok) [self _closeReportSheet];
		else NSBeep();
		return;
	} else NSBeep();
	
	[self _closeReportSheet];
}

- (IBAction) _report_btn_changePlugin:(id) sender {
	WebSMSPlugin *plg = [[WebSMSPluginManager sharedManager] getPluginWithName: [_report_plugin titleOfSelectedItem]];
	[_report_fld_authorname setStringValue: [NSString stringWithFormat: @"%@ (%@)",[[plg reportContacts] objectForKey: _plugin_report_name],[[plg reportContacts] objectForKey: _plugin_report_email]]];
}

- (IBAction) _report_btn_cancel:(id) sender {
	[self _closeReportSheet];
}

- (BOOL)sendEmailTo:(NSString *)to subject:(NSString *)subject body:(NSString *)messageBody attachment:(NSString *)filePath
{
	NSDictionary *headers;
	NSMutableAttributedString *msg;
	
	msg = [[[NSMutableAttributedString alloc] initWithString:(messageBody ? messageBody : @"")] autorelease];
	
	if (filePath && [[NSFileManager defaultManager] fileExistsAtPath:filePath])
	{
		NSTextAttachment *ta = [[[NSTextAttachment alloc] initWithFileWrapper:[[[NSFileWrapper alloc] initWithPath:filePath] autorelease]] autorelease];
		if (ta)
			[msg appendAttributedString:[NSAttributedString attributedStringWithAttachment:ta]];
	}
	
	headers = [NSDictionary dictionaryWithObjectsAndKeys:
		[_report_fld_contact stringValue], @"From",
		to, @"To",
		subject, @"Subject",
		@"Apple Message", @"X-Mailer",
		@"multipart/mixed", @"Content-Type",
		@"1.0", @"Mime-Version",
		nil];
	
	return [NSMailDelivery deliverMessage:msg
								  headers:headers
								   format:NSMIMEMailFormat
								 protocol: NSSMTPDeliveryProtocol];
}

- (IBAction) btn_export:(id) sender {
	NSSavePanel *panel = [NSSavePanel savePanel];
	[panel setTitle: NSLocalizedStringFromTable(@"UI_Report_Export",@"Dialogs",@"")];
	[panel beginSheetForDirectory: nil file: nil modalForWindow:ass_wnd_ActivityWindow
									modalDelegate:self didEndSelector:@selector(saveSourceEndPanel:returnCode:contextInfo:)  
									contextInfo:nil];
}

- (void)saveSourceEndPanel:(NSOpenPanel *)panel returnCode:(int)returnCode  contextInfo:(void  *)contextInfo {
	if (returnCode == 1) {	
		[[tbl_logsItems componentsJoinedByString:@""] writeToFile: [panel filename] atomically:NO];
	}
}

@end
