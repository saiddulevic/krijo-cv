/**
 * Undo/redo history of project snapshots. A snapshot keeps the project as a
 * JSON string without the photo, plus a reference to the photo object, so
 * dozens of steps do not duplicate megabytes of image data.
 */

const DEFAULT_LIMIT = 60;

/** JSON of the project without the (large) photo. */
function projectJson(project) {
    return JSON.stringify(project, (key, value) => (key === 'photo' ? null : value));
}

export function snapshotOf(project) {
    const photo = project.photo
        ? { data: project.photo.data, source: project.photo.source ?? null, crop: project.photo.crop ? { ...project.photo.crop } : null }
        : null;
    const json = projectJson(project);
    const photoKey = photo ? `${photo.data.length}:${photo.data.slice(-48)}:${JSON.stringify(photo.crop)}` : '';
    return { json, photo, key: `${json}|${photoKey}` };
}

/** Rebuilds a plain project object from a snapshot. */
export function restoreSnapshot(snapshot) {
    const project = JSON.parse(snapshot.json);
    project.photo = snapshot.photo ? { ...snapshot.photo, crop: snapshot.photo.crop ? { ...snapshot.photo.crop } : null } : null;
    return project;
}

export class History {
    constructor(limit = DEFAULT_LIMIT) {
        this.limit = limit;
        this.past = [];
        this.future = [];
        this.current = null;
    }

    /** Starts a new history whose first state is the given snapshot. */
    reset(snapshot) {
        this.past = [];
        this.future = [];
        this.current = snapshot;
    }

    /** Records a new state; returns false when nothing changed. */
    record(snapshot) {
        if (this.current && this.current.key === snapshot.key) {
            return false;
        }
        if (this.current) {
            this.past.push(this.current);
            if (this.past.length > this.limit) {
                this.past.shift();
            }
        }
        this.current = snapshot;
        this.future = [];
        return true;
    }

    get canUndo() {
        return this.past.length > 0;
    }

    get canRedo() {
        return this.future.length > 0;
    }

    /** Returns the previous snapshot (now current) or null. */
    undo() {
        if (!this.canUndo) return null;
        this.future.push(this.current);
        this.current = this.past.pop();
        return this.current;
    }

    /** Returns the next snapshot (now current) or null. */
    redo() {
        if (!this.canRedo) return null;
        this.past.push(this.current);
        this.current = this.future.pop();
        return this.current;
    }
}
