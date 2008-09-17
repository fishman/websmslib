//
//  MainWndController.m
//  PDFMergeX
//
//  Created by malcom on 09/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "MainWndController.h"
#import <SSCrypto/SSCrypto.h>

typedef enum MainToolbar_Items {
	/* FILE MENU */
    MainToolbar_Items_SwitchMode			= 1,
    MainToolbar_Items_ManagePages			= 2
} MainToolbar_Items;

@implementation MainWndController

@synthesize ass_documentController;
@synthesize controller_previewWindow;

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
	BOOL lic = [self lic];
	//NSData *privatekey = [SSCrypto generateRSAPrivateKeyWithLength: 512];
	//[privatekey writeToFile: @"/Users/malcom/Desktop/PrivateKeyPDFMerge.key" atomically: NO];
	//[[SSCrypto generateRSAPublicKeyFromPrivateKey: privatekey]  writeToFile: @"/Users/malcom/Desktop/PublicKeyPDFMerge.key" atomically: NO];

	if (!lic) {
		cDownCounter = 5;
		[btn_notNow setEnabled: NO];
		[btn_license setEnabled: NO];
		[ass_regWindow center];
		cDownTimer = [NSTimer timerWithTimeInterval: 1 target: self selector: @selector(_count:) userInfo: nil repeats: YES];
		[[NSRunLoop currentRunLoop] addTimer: cDownTimer forMode: NSRunLoopCommonModes];

		
		_session = [NSApp beginModalSessionForWindow:  ass_regWindow];
		_endSession = NO;
		
		for (;;) {
			if ([NSApp runModalSession:_session] != NSRunContinuesResponse || _endSession == YES)
				break;
		}
		[NSApp endModalSession:_session];
	}
}

- (void) _count:(NSTimer*)theTimer {
	cDownCounter--;
	[btn_notNow setTitle:[NSString stringWithFormat:@"Wait %d...",cDownCounter]];
	
	if (cDownCounter == 0) {
		[cDownTimer invalidate];
		[btn_notNow setEnabled: YES];
		[btn_license setEnabled: YES];

		[btn_notNow setTitle: @"Not Now"];
	}
}

- (IBAction) btn_license:(id) sender {
	[[NSUserDefaults standardUserDefaults] setObject: [[fld_key stringValue] dataUsingEncoding:NSISOLatin1StringEncoding] forKey:@"Key"];
	[[NSUserDefaults standardUserDefaults] setObject: [fld_username stringValue] forKey:@"Username"];
	
	if ([self lic]) {
		[self _closeRegWindow];
		NSBeginAlertSheet(@"Thank you!",
						  @"OK",nil,nil,
						  ass_mainWindow ,self,nil,NULL,nil,
						  [NSString stringWithFormat: @"Thank you %@ for supporting PDFMergeX!",[fld_username stringValue]]);

		
	} else NSBeep();
}

- (IBAction) btn_notNow:(id) sender {
	if (cDownCounter == 0) [self _closeRegWindow];
}
		
- (void) _closeRegWindow {
	_endSession  = YES;
	[ass_regWindow orderOut: nil];
}
		

- (BOOL) lic {
	NSString *myinfo = [[NSUserDefaults standardUserDefaults] objectForKey: @"Username"];
	NSData *licekey = [[[NSUserDefaults standardUserDefaults] objectForKey: @"Key"] decodeBase64];

	if ([myinfo length] == 0 || [licekey length] == 0) return NO;

		
	NSString *publicKeyPath  = [NSString stringWithFormat: @"%@/PublicKeyPDFMerge.key",[[NSBundle mainBundle] resourcePath]];
	NSData *publicKey  = [NSData dataWithContentsOfFile:publicKeyPath];
	
	SSCrypto *	crypto = [[SSCrypto alloc] initWithPublicKey: publicKey];
	[crypto setCipherText: licekey];
	
	NSLog(@"crypto verify: %@", [crypto verify]);
    
	NSString *givenDecodedAddress = [[NSString alloc] initWithData: [crypto verify] encoding:NSUTF8StringEncoding];
	
	NSLog(@"Original decrypt: [%@]",givenDecodedAddress);
	
	NSLog(@"Is %@ equal to %@",givenDecodedAddress,myinfo);
	return [myinfo isEqualToString: givenDecodedAddress];
}


- (void) awakeFromNib {
	[self _updateTBItemVisibility];

	ass_documentController = [[PDFDocumentsController alloc] initWithPDFsFiles: nil];
	[ass_tabView setDelegate: self];
//	[ass_mainWindowToolbar setDelegate: self];
	dropImageView.ass_delegate = self;
}

- (void) addPDFDocuments:(NSArray *) _paths {
	if (ass_documentController == nil)
		ass_documentController = [[PDFDocumentsController alloc] initWithPDFsFiles: _paths];
	else
		[ass_documentController addPDFDocumentsPaths: _paths];
	
	
	[ass_tabView selectTabViewItemAtIndex: 1];
	[controller_pdfList.tbl_listedPDFs reloadData];

	[self _updateTBItemVisibility];
}

- (IBAction) btn_changeSwitchMode:(id) sender {
	if ([ass_documentController totalDocuments] > 0) {
		[ass_tabView selectTabViewItemAtIndex: [sender selectedSegment]+1];
		[self _updateTBItemVisibility];
	}
}

- (BOOL)validateToolbarItem:(NSToolbarItem *)theItem {	
	switch ([theItem tag]) {
		case MainToolbar_Items_SwitchMode:
			return ([ass_documentController totalDocuments] > 0);
			break;
		case MainToolbar_Items_ManagePages:
			return [ass_tabView indexOfTabViewItem: [ass_tabView selectedTabViewItem]] == 2;
			break;
	}
	
	return YES;
}

- (BOOL)tabView:(NSTabView *)tabView shouldSelectTabViewItem:(NSTabViewItem *)tabViewItem {
	int sel = [ass_tabView indexOfTabViewItem: tabViewItem];
	if (sel == 1 && controller_advancedMerge.advancedWorkflow != nil) {
		[sgm_workMode selectSegmentWithTag: 2];

		NSBeginAlertSheet(@"Discard custom workflow?",@"Discard",@"Cancel", nil, 
							ass_mainWindow, self, 
							@selector(discardAdvancedWorkflow:returnCode:contextInfo:), nil, 
							nil, 
							@"If you will return in simple mode you will lost your custom workflow. Are you sure?");
		return NO;
	}
	
	return YES;
}

- (void) discardAdvancedWorkflow:(NSOpenPanel *)panel returnCode:(int)returnCode  contextInfo:(void  *)contextInfo {
	if (returnCode == NSAlertDefaultReturn ) { // OK DISCARD
		controller_advancedMerge.advancedWorkflow = nil;
		[ass_tabView selectTabViewItemAtIndex: 1];
		[sgm_workMode selectSegmentWithTag:1];
		[self _updateTBItemVisibility];
	}
}


- (void) _updateTBItemVisibility {
	int sel = [ass_tabView indexOfTabViewItem: [ass_tabView selectedTabViewItem]];
	[ass_mainWindowToolbar setVisible: YES];

	[tbitem_managePages setEnabled: sel == 2];
	[tbitem_pairPages setEnabled: sel == 2];
	[tbitem_combine setEnabled: sel > 0];
	[tbitem_preview setEnabled: sel > 0];
	[tbitem_thumbsSize setEnabled: sel == 2];
	[sgm_workMode setEnabled: sel > 0];
	
	switch ([sgm_workMode selectedSegment]) {
		case 0: [ass_workMode setLabel: @"Simple Mode"]; break;
		case 1: [ass_workMode setLabel: @"Advanced Mode"]; break;
	}
}

- (void)tabView:(NSTabView *)tabView willSelectTabViewItem:(NSTabViewItem *)tabViewItem {
	int sel = [ass_tabView indexOfTabViewItem: tabViewItem];
	
	switch (sel) {
		case 2: // ADVANCED MODE
			[controller_advancedMerge allocWorkflowForDocumentController: ass_documentController];
			break;
	}
	
//	[self _updateTBItemVisibility];

}

- (IBAction) btn_showPreview:(id) sender {
	[controller_previewWindow.ass_previewWindow makeKeyAndOrderFront:nil];
	if ( [ass_tabView indexOfTabViewItem: [ass_tabView selectedTabViewItem]] ==2)
		[controller_previewWindow loadPreviewFor: [controller_advancedMerge selectedPage]];
	else
		[controller_previewWindow loadPreviewFor: [controller_pdfList selectedDocument]];
}

- (IBAction) btn_assemblyPDF:(id) sender {
	NSSavePanel *panel = [NSSavePanel savePanel];
	[panel setTitle: @"Destination PDF name"];
	[panel setAccessoryView: view_saveView];
	
	[view_saveView_author setStringValue: NSUserName()];
	[view_saveView_title setStringValue: @"A PDF combined with PDFMergeX"];
	
	if ([panel runModalForDirectory:nil file:nil] == NSOKButton) {
		NSString *fName = ([[[panel filename] pathExtension] length] < 2 ? [NSString stringWithFormat: @"%@.pdf",[panel filename]] : [panel filename]);
		
		NSMutableDictionary *_att = [[NSMutableDictionary alloc] initWithObjectsAndKeys: @"PDFMergeX for Mac OS X",PDFDocumentCreatorAttribute,nil,nil];
		if ([view_saveView_author stringValue] != nil) [_att setObject: [view_saveView_author stringValue] forKey:PDFDocumentAuthorAttribute];
		if ([view_saveView_title stringValue] != nil) [_att setObject: [view_saveView_title stringValue] forKey:PDFDocumentTitleAttribute];			
		
		switch ([ass_tabView indexOfTabViewItem: [ass_tabView selectedTabViewItem]]) {
			case 2:
				[controller_advancedMerge.advancedWorkflow assemblyDocumentAtDestination: fName withAttributes: _att];
				break;
			case 1: {
				PDFMergeWorkflow *simpleWorkflow = [PDFMergeWorkflow workflowWithDocumentsController: [controller_pdfList _documentController] andDelegate: self];
				[simpleWorkflow resetPagesListOrder];
				[simpleWorkflow assemblyDocumentAtDestination: fName withAttributes: _att];
			break; }
	}
	}
}


- (void) pdfMergeWf_startAssemblyForDocuments:(PDFDocumentsController *) _docs totalPages:(int) _pages destination:(NSString *) _dest {
	[NSApp beginSheet: ass_progressWindow 
	   modalForWindow: ass_mainWindow
		modalDelegate:self 
	   didEndSelector:NULL 
		  contextInfo:nil];
	
	[ass_progressIndicator setMaxValue: _pages];
	[ass_progressIndicator setMinValue: 0];
	[ass_progressIndicator setDoubleValue: 0.0];
	[ass_progressIndicator setIndeterminate: NO];
	[ass_progressIndicator setUsesThreadedAnimation: YES];

	[ass_progressTitle setStringValue: [NSString stringWithFormat: @"Assembling %@...",[_dest lastPathComponent]]];
	[ass_progressSubTitle setStringValue: @"Please wait..."];

}

- (void) pdfMergeWf_assemblyPage:(PDFRawPage *) _page {
	[ass_progressIndicator setDoubleValue: [ass_progressIndicator doubleValue]+1];
	
	if (_page.ass_pageType == PDFPage_Type_PageContainer) {
		PDFPageContainer *cont = (PDFPageContainer *)_page;
		[ass_progressSubTitle setStringValue: 
			[NSString stringWithFormat: @"Assembling page %d of %@",
				cont.ass_originalDocPageIndex,
				[((PDFMergerDocument*)cont.ass_document).ass_absolutePath lastPathComponent]]];
	} else
		[ass_progressSubTitle setStringValue: @"Assembling with empty page"];

}

- (void) pdfMergeWf_writingDocument:(PDFDocument *) _doc {
	[ass_progressIndicator setIndeterminate: YES];
	[ass_progressIndicator startAnimation:nil];
	[ass_progressTitle setStringValue: @"Writing final file..."];
	[ass_progressSubTitle setStringValue: @"This operation could take a while"];
}


- (void) pdfMergeWf_assemblyFinished:(PDFDocumentsController *) workflowDocuments {
	[NSApp endSheet: ass_progressWindow];
	[ass_progressWindow orderOut:nil];
}

- (IBAction) btn_managePages:(id) sender {
	if ( [ass_tabView indexOfTabViewItem: [ass_tabView selectedTabViewItem]] ==2) {
		switch ( [((NSSegmentedControl*)sender) selectedSegment]) {
			case 0:
				[controller_advancedMerge btn_addEmptyPage];
				break;
			case 1:
				[controller_advancedMerge btn_removePage];
				break;
			case 2:
				[controller_advancedMerge btn_importPages];
				break;
		}
	}
}

- (IBAction) btn_pairPages:(id) sender {
	if ( [ass_tabView indexOfTabViewItem: [ass_tabView selectedTabViewItem]] ==2) [controller_advancedMerge btn_pairPages];
}

- (IBAction) showAbout:(id) sender {
	[window_about center];
	[window_about makeKeyAndOrderFront: nil];
	[window_about_version setStringValue: [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"]];
}

- (IBAction) btn_ab_webSite:(id) sender {
	[[NSWorkspace sharedWorkspace] openURL: [NSURL URLWithString: @"http://www.malcom-mac.com/blog"]];
}

- (IBAction) btn_ab_donate:(id) sender {
	[[NSWorkspace sharedWorkspace] openURL: [NSURL URLWithString: @"http://www.malcom-mac.com/pdfmergex/"]];
}

@end

