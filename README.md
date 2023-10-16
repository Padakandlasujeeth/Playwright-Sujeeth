<!-- TABLE OF CONTENTS -->
<h2>
    <details open="open">
        <summary class="normal">Table of Contents</summary>
        <h5>
          <ol>
            <li>
              <a href="#about-the-project">About the Project</a>
              <ul>
                <li><a href="#built-with">Built With</a>
              </ul>
            </li>
            <li>
              <a href="#getting-started">Getting Started</a>
              <ul>
                <li><a href="#prerequisites">Prerequisites</a>
                <li><a href="#installation">Installation</a>
              </ul>
            </li>
            <li><a href="#usage">Usage</a></li>
            <li><a href="#reports">Reports</a></li>
            <li><a href="#sonarqube">SonarQube</a></li>
            <li><a href="#docker">Docker</a></li>
            <li><a href="#lighthouse">Lighthouse</a></li>
          </ol>
        </h5>    
    </details>
</h2>

<!-- ABOUT THE PROJECT -->

## About the Project

Playwright Test - This project is based on Microsoft Playwright which enables reliable end-to-end testing for modern web apps.

Top Features:

- Easy to Configure.
- Auto-waits for all the relevant checks to pass and only then performs the requested action.
- Records videos for Test Cases.
- Records the test script and every action on the target page is turned into generated script.
- Generates trace file, which gives in-depth details of Test Case execution.
- Execution of test case is faster when compared with other competitive framework in market.
- Supports Headful/Headless mode execution for Firefox/Webkit/Google Chrome/Chromium/MS Edge on Windows/Linux/Mac machines.
- Supports API testing (From Playwright version 1.16 onwards)
- Can be used to simulate browser behaviour on mobile devices, and supports over 100+ devices.
- Has ability to produce and visually compare screenshots.
- Supports Serial and Parallel execution.


### Built With

- [Playwright](https://playwright.dev)
- [Typescript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

The following software are required:

- nodejs : Download and Install Node JS from
  ```sh
  https://nodejs.org/en/download/
  ```

### Installation

1. install npm packages using:

```sh
npm install
```
3. For first time installation run below command to download required browsers

```sh
npx playwright install
```

<!-- USAGE EXAMPLES-->

## Usage

`Recommended:` 
npm run test:serial --ENV="qa" (By default runs in headless mode) 
npm run test:headMode --ENV="qa"


1. For Browser Configuration, change required parameters in `playwright.config.ts`.

2. For execution entire test suite on all available browsers simultaneously execute below command where "ENV" is "qa", 
`Test Cases are present in "tests" folder`:

```JS
 npm run test:multibrowser --ENV="qa" 
```

3. For executing single test case on Chrome browser execute the below command, you can change the browser for execution e.g. if you want to run test cases on Firefox, you can change `--project=firefox` against `test:single` in `package.json`, just make sure the browser name given matches the name given in `playwright.config.ts`.

```JS
npm run test:single --ENV="qa"
```

4. For executing test cases in parallel, provide a suitable tag `@SmokeTest` at the start of your test case name, then in `package.json` against `test:parallel` give the tag value and execute :

```JS
npm run test:parallel --ENV="qa"
```

5. For executing test cases in sequence, provide a suitable tag `@SmokeTest` at the start of your test case name, then in `package.json` against `test:serial` give the tag value and execute, `workers` parameter correspond to test cases you want to execute simultaneously e.g. `--workers=3`, executes 3 test cases simultaneously :

```JS
npm run test:serial --ENV="qa"
```

6. For executing API test cases, tag tests with `@api`:

```JS
npx playwright test --grep @api --project=Chrome
```

7. For emulating test cases on any device, in `playwright.config.ts`, under device section provide desired device name and execute :

```JS
npm run test:device --ENV="qa"
```
8. For executing Functional test cases, test cases are present in `tests/functional`

```JS
npx playwright test tests/functional --project=Chrome
```

9. For executing Functional test cases, tests are present in `tests/e2e`

```JS
npx playwright test tests/e2e --project=Chrome
```

9. For executing test cases in headed mode.

```JS
npx playwright test --workers=1 --project=Chrome --headed
```


## Reports

- Test results and detailed reports can be found in the `playwright-report` folder for your reference and analysis.
- By default report is set to html, but can be updated by adding `--reporter=list`
- To display report run `npx playwright show-report`


## SonarQube

Once you have completed setup for SonarQube given in Prerequisites section, configure SonarQube as given below
- Go to the path where sonarqube server(For e.g. : C:\SonarQube\sonarqube-9.1.0.47736) is unzipped -> Go to conf Folder -> open sonar.properties file and add the below prperties and save the file, you can give any port you wish I have used port 9000.
```JS
sonar.host.url=http://localhost:9000
sonar.sourceEncoding=UTF-8
```
- Go to the path where sonarqube server(For e.g. : C:\SonarQube\sonarqube-9.1.0.47736) is unzipped -> Go to bin section -> Go to the folder as per the OS you are using , in my case windows-x86-64 -> Double click on Start Sonar and wait for it to display SonarQube is up (you might encounter some java errors but its fine don't close the terminal).
- Go to the browser and naigate to http://localhost:9000 , default username is `admin`, default password is `admin`. It might ask you to provide a new password for if you have logged in for first time.
- In your working project (playwright-typescipt-playwright-test), navigate to `sonar-project.properties` file and provide the credentials configured on server webpage username value in `sonar.login` and password in `sonar.password`
```JS
sonar.login=admin
sonar.password=admin
```
- You can provide any project name in `sonar.projectKey`.
- Specify a version in `sonar.projectVersion`.
- Provide `UTF-8` in `sonar.sourceEncoding`.
- In `sonar.language` provide the language you want to run scan on (For e.g. for typescipt its ts and for javascript its js).
- If you have eslint file in your project provide the location in `sonar.eslint.eslintconfigpath`.
- You can exclude file from scanning like node_modules, results , Downloads section in `sonar.exclusions`.
- You can give your project location in `sonar.sources` section I have provided it as `./` because my `sonar-project.properties` file is within my project. If your properties files is somewhere else you have to provide the complete project path.
- Now go to the location where `sonar-project.properties` is present and run `sonar-scanner` command (In my case I will diectly run it inside my project), and wait for scan to get over with success message.
- Now navigate to `http://localhost:9000/` and click on your project key displayed and go to Issues section, you can find all the suggestions and issues here. You can fix the issues ans rerun `sonar-scanner` command once again.
- <b>SonarQube Report</b>
  ![SonarQube Report Screenshot][sonar-report-screenshot]

  ## Docker
  For running the tests on Docker container we have to first build a image from Dockerfile and then run the image to spawn container on which the test scripts will run.
- For building image from Docker run below command, where path to Dockerfile must be provided after -f tag and name of the image must be provided after -t tag.
```JS
docker build . -f Dockerfile -t playtest
```
- Once the image is generated we can run the image to spawn container and run scrips using below command. In Below Command "playContainer" is name of the container created using "playtest" image.
```JS
docker run --name playContainer playtest
```
- If you want to run a different test or provide custom command, Go to Dockerfile and edit the last line which is CMD section. The below sample runs test cases serially on QA environment.
Once you have edited the CMD section we have to follow Step 1 to build a new image and ten run the Container from that image.
```JS
CMD npm run test:serial --ENV="qa"
```

