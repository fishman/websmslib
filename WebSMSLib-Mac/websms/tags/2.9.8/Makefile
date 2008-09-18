TARGET_NAME=WebSMS
RELEASE_DIR=release
VERSION=`defaults read \`pwd\`/WebSMS.wdgt/Info CFBundleVersion`
# What a dirty trick...
VERSION_P=`defaults read \`pwd\`/../WebSMS.wdgt/Info CFBundleVersion`
DIST_FILES=AddressBook\ Plugin example.conf.js $(TARGET_NAME).wdgt $(TARGET_NAME).widget \
$(TARGET_NAME).tmproj Makefile plugins protocols lib artwork test

.PHONY: all release clean plugin docs js-test objc-test all-tests

all: release dist

install: release
	cp -fR $(RELEASE_DIR)/$(TARGET_NAME).wdgt ~/Library/Widgets/
	touch ~/Library/Widgets/$(TARGET_NAME).wdgt

release: plugin
	mkdir -p $(RELEASE_DIR)/$(TARGET_NAME).wdgt
	cp -R $(TARGET_NAME).wdgt $(RELEASE_DIR)
	cp -fR plugins $(RELEASE_DIR)/$(TARGET_NAME).wdgt
	cp -fR lib $(RELEASE_DIR)/$(TARGET_NAME).wdgt
	mkdir -p $(RELEASE_DIR)/$(TARGET_NAME).widget
	cp -R $(TARGET_NAME).widget $(RELEASE_DIR)
	cp -fR plugins $(RELEASE_DIR)/$(TARGET_NAME).widget
	cp -fR lib $(RELEASE_DIR)/$(TARGET_NAME).widget
	find $(RELEASE_DIR) -name .svn -ls -exec rm -rf {} \; ; true
	cd $(RELEASE_DIR); zip -r $(TARGET_NAME)-$(VERSION_P).zip $(TARGET_NAME).wdgt
	cd $(RELEASE_DIR); zip -r $(TARGET_NAME)-$(VERSION_P).widget $(TARGET_NAME).widget
	#rm -rf $(RELEASE_DIR)/$(TARGET_NAME).wdgt
	#rm -rf $(RELEASE_DIR)/$(TARGET_NAME).widget

dist:
	mkdir -p $(RELEASE_DIR)/$(TARGET_NAME)-$(VERSION)\ Source
	cp -fR $(DIST_FILES) $(RELEASE_DIR)/$(TARGET_NAME)-$(VERSION)\ Source
	find $(RELEASE_DIR) -name .svn -ls -exec rm -rf {} \; ; true
	cd $(RELEASE_DIR); zip -r $(TARGET_NAME)-$(VERSION_P).source.zip $(TARGET_NAME)-$(VERSION_P)\ Source
	rm -rf $(RELEASE_DIR)/$(TARGET_NAME)-$(VERSION)\ Source

plugin:
	cd AddressBook\ Plugin; xcodebuild -target ABPlugin -configuration Release
	cp -fR AddressBook\ Plugin/build/Release/ABPlugin.widgetplugin $(TARGET_NAME).wdgt

docs:
	cd AddressBook\ Plugin; headerdoc2html -o Documentation *.h Test/*.h Test/TestRunner/*.h

all-tests: objc-test js-test

objc-test:
	true

js-test:
	cd test; open *.html; open functional/*.html

clean:
	rm -rf $(RELEASE_DIR)