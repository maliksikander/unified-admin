const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl: 'https://sonarqube.expertflow.com',
        options: {
            'sonar.qualitygate.wait': 'true',
            'sonar.qualitygate.timeout': '1600'
        }
    }, () => { });
