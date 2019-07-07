import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'
import { PostService } from '../post.service';
import {Post} from '../post';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-posts-detail',
  templateUrl: './posts-detail.component.html',
  styleUrls: ['./posts-detail.component.css']
})
export class PostsDetailComponent implements OnInit {
  post: Post;
  editing:boolean = false;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPosts()
  }

  getPosts(){
    const id = this.route.snapshot.paramMap.get('id')
    return this.postService.getPostData(id).subscribe(data => this.post=data)
  }

  delete() {
    const id = this.route.snapshot.paramMap.get('id')
    this.postService.delete(id)
    this.router.navigate(["/blog"])
  }

  updatePost(){
    const formData = {
      title: this.post.title,
      content: this.post.content
    }
    const id = this.route.snapshot.paramMap.get('id')
    this.postService.update(id, formData)
    this.editing = false
  }

}
