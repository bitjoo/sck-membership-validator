require('dotenv').config({ path: '.env.local' });

const FtpDeploy = require("ftp-deploy");
const path = require("path");

const ftpDeploy = new FtpDeploy();

const { 
    FTP_USER,
    FTP_PASSWORD,
    FTP_HOST,
    FTP_REMOTE_ROOT
 } = process.env;

const config = {
    user: FTP_USER,
    // Password optional, prompted if none given
    password: FTP_PASSWORD,
    host: FTP_HOST,
    port: 22,
    localRoot: path.resolve(process.cwd(), "out"),
    remoteRoot: FTP_REMOTE_ROOT,
    include: ["*", "**/*"],      // this would upload everything except dot files
    // include: ["*.php", "dist/*", ".*"],
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    //exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
    exclude: ["membership_ids.json"],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
    // use sftp or ftp
    sftp: true
};

ftpDeploy
    .deploy(config)
    .then(res => console.log("FTP Deployment:", res))
    .catch(err => console.log(err));