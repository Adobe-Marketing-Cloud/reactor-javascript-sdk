/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import reactor from './reactor';
import helpers from './helpers';

// ExtensionPackages
// https://developer.adobelaunch.com/api/extension_packages:
describe('ExtensionPackage API', function() {
  var corePackage;

  beforeAll(async function() {
    corePackage = await helpers.coreExtensionPackage();
    // thePackage = await createTestExtensionPackage(
    //   './package-hello-world-1.0.0.zip',
    // );
  });

  afterAll(async function() {
    // await reactor.deleteExtensionPackage(corePackage.id);
  });

  // Creates and returns an ExtensionPackage.
  // TODO: figure out how to upload a file. Tests requiring the ability to
  // create an ExtensionPackage may need to be restriced to Node environments.
  async function createTestExtensionPackage(filename) {
    helpers.specName = `while installing ExtensionPackage from "${filename}"`;
    try {
      const response = await reactor.createExtensionPackage(filename);
      expect(response.data.id).toMatch(helpers.idEP);
      return response.data;
    } catch (error) {
      helpers.reportError(error);
    }
    helpers.specName = null;
  }

  // Create an ExtensionPackage
  // https://developer.adobelaunch.com/api/extension_packages/create/
  helpers
    .xit('creates a new ExtensionPackage', async function() {
      // TODO: test createExtensionPackage
      const hello = await createTestExtensionPackage(
        './package-hello-world-1.0.0.zip'
      );
      expect(hello.id).toMatch(helpers.idEP);

      helpers.deleteExtensionPackage(hello.id);
    })
    .pend('requires file upload (can that even happen from a browser?)');

  // Get an ExtensionPackage
  // https://developer.adobelaunch.com/api/extension_packages/fetch/
  helpers.it('gets an ExtensionPackage', async function() {
    // An ExtensionPackage is created in beforeAll().
    if (!corePackage || !corePackage.id) return;
    const response = await reactor.getExtensionPackage(corePackage.id);
    expect(response.data.id).toBe(corePackage.id);
    expect(response.data.type).toBe('extension_packages');
  });

  // List all the available ExtensionPackages
  // https://developer.adobelaunch.com/api/extension_packages/list/
  helpers.it('lists all ExtensionPackages', async function() {
    const listResponse = await reactor.listExtensionPackages();
    expect(typeof listResponse.data).not.toBeNull();

    const fb = await helpers.findNamedExtensionPackage('facebook-pixel');
    const aa = await helpers.findNamedExtensionPackage('adobe-analytics');
    const rcId = corePackage.id;
    const fbId = fb.id;
    const aaId = aa.id;

    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(rcId);
    expect(allIds).toContain(fbId);
    expect(allIds).toContain(aaId);
  });

  // PrivateRelease an ExtensionPackage
  // https://developer.adobelaunch.com/api/extension_packages/release_private/
  helpers
    .xit('private releases an ExtensionPackage', async function() {
      //TODO: test privateReleaseExtensionPackage
      const hello = await createTestExtensionPackage(
        './package-hello-world-1.0.0.zip'
      );
      expect(hello.id).toMatch(helpers.idEP);

      const hello2 = helpers.updateExtensionPackage(
        hello.id,
        './package-hello-world-1.1.0.zip'
      );
      expect(hello2.id).toMatch(helpers.idEP);

      await deleteExtensionPackage(hello.id);
      await deleteExtensionPackage(hello2.id);
    })
    .pend('requires file upload (can that even happen from a browser?)');

  // Update an ExtensionPackage
  // https://developer.adobelaunch.com/api/extension_packages/update/
  helpers
    .xit('updates an ExtensionPackage', async function() {
      //TODO: test updateExtensionPackage
      const hello = await createTestExtensionPackage(
        './package-hello-world-1.0.0.zip'
      );
      expect(hello.id).toMatch(helpers.idEP);

      const hello2 = helpers.updateExtensionPackage(
        hello.id,
        './package-hello-world-1.1.0.zip'
      );
      expect(hello2.id).toMatch(helpers.idEP);

      await deleteExtensionPackage(hello.id);
      await deleteExtensionPackage(hello2.id);
    })
    .pend('requires file upload (can that even happen from a browser?)');
});
