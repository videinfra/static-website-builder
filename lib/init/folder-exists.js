import fs  from 'fs';

export default function folderExists (folder) {
    try {
        const stat = fs.lstatSync(folder);
        return stat.isDirectory();
    } catch (err) {
        return false;
    }
}
