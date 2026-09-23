import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database } from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit
{
    private db: Database;

    onModuleInit() {
        const dbPath = path.resolve(process.cwd(), 'bookvault.db')
        this.db = new Database(dbPath , (err)=>
            {
                if(err)
                    {
                        console.error('❌ Database connection failed:', err.message);
                        return;
                    }
                console.log('✅ Connected to SQLite database');

                const schema = fs.readFileSync(
                    path.join(__dirname , 'schema.sql'),
                    'utf-8',
                );
                this.db.exec(schema , (execErr)=>
                    {
                        if(execErr)
                            {
                                console.error('❌ Schema initialization failed:', execErr.message);
                                return;
                            }
                        console.log('✅ Database schema initialized');
                    })
            
            })
    }

    getDB(): Database{
        return this.db
    }

    run(sql: string , params: any[] = []): Promise<any>
        {
            return new Promise((resolve , reject)=>
                {
                    this.db.run(sql , params , function(err)
                    {
                        if(err) reject(err)
                            resolve({ lastID: this.lastID , changes: this.changes})
                    })
                })
        }
    get(sql: string , params: any[]= []): Promise<any>
    {
        return new Promise((resolve , reject)=>
            {
                this.db.get(sql , params , (err , row)=>
                    {
                        if(err) return reject(err)
                        resolve(row)
                    })
            })
    }
    all(sql:string , params: any[]= []): Promise<any>
    {
        return new Promise((reject , resolve)=>
            {
                this.db.all(sql , params , (err , rows)=>
                    {
                        if(err) return reject(err)
                        resolve(rows)
                    })
            })
    }


}