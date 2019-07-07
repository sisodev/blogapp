import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { PostService } from '../post.service';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-posts-dashboard',
  templateUrl: './posts-dashboard.component.html',
  styleUrls: ['./posts-dashboard.component.css']
})
export class PostsDashboardComponent implements OnInit {
  title:string
  image:string = null
  content:string
  buttonText:string = "Create Post"
  uploadPercent: Observable<number>
  downloadUrl: Observable<string>


  constructor(private auth: AuthService, private postService: PostService, private storage: AngularFireStorage) { }

  ngOnInit() {
  }

  createPost(){
    const data = {
      author:  this.auth.authState.displayName ||  this.auth.authState.email,
      authorId: this.auth.currentUserId,
      content: this.content,
      image:  this.image,
      published:  new Date(),
      title: this.title
    }
    this.postService.create(data)
    this.title=null;
    this.content=null;
    this.buttonText = 'Post Created!'
    setTimeout(() => this.buttonText="Create Post",1000)
  }

  uploadImage(e) {
    const file = e.target.files[0]
    const path = `posts/${file.name}`
    if(file.type.split('/')[0] !== 'image') {
      return alert('only images')
    } else {
      const task = this.storage.upload(path,file)
      const ref = this.storage.ref(path)
      this.uploadPercent = task.percentageChanges()
      console.log("Image Uploaded")
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadUrl = ref.getDownloadURL()
           this.downloadUrl.subscribe(url => (this.image = url));
        })
      ).subscribe()
    }

  }

}
